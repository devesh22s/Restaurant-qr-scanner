import crypto from 'crypto';
import Razorpay from "razorpay";
import Order from "../model/order.js";
import Cart from "../model/cart.js";
import Coupon from "../model/coupon.js"; 
import Menu from "../model/menu.js"; 
import myModel from "../model/User.js";
import Table from "../model/table.js"; 
import { SuccessResponse, ErrorResponse } from "../utils/responseWrapper.js";

// ==========================================
// ✅ 1. SAFE RAZORPAY INITIALIZATION
// ==========================================
let razorpay;
try {
    const keyId = process.env.RAZORPAY_API_KEY || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_API_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret) {
        razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    } else {
        console.warn("⚠️ WARNING: Razorpay Keys Missing. Online payments will fail, but Server is ON.");
    }
} catch (err) {
    console.error("Razorpay Init Error:", err.message);
}

const generateOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// ==========================================
// ✅ 2. PLACE ORDER (Unified Controller)
// ==========================================
export const placeOrder = async (req, res, next) => {
  try {
    const { 
      couponCode, paymentMethod, tableNumber, 
      customerName, customerPhone, customerEmail, notes 
    } = req.body;

    const { type, id } = req.identity;

    // --- Validation ---
    if (!tableNumber) return ErrorResponse(res, 400, "Table number is required");
    if (!customerPhone) return ErrorResponse(res, 400, "Phone number is required");

    // --- Fetch Cart ---
    let query = type === 'user' ? { userId: id } : { sessionToken: id };
    const cart = await Cart.findOne(query);

    if (!cart || cart.items.length === 0) {
      return ErrorResponse(res, 400, "Cart is empty");
    }

    // --- Calculate Subtotal ---
    let subTotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const menu = await Menu.findById(item.menuItemId);
      if (menu) { 
        const itemTotal = menu.price * item.quantity;
        subTotal += itemTotal;
        orderItems.push({
          menuItemId: menu._id,
          name: menu.name,
          price: menu.price,
          quantity: item.quantity,
          subTotal: itemTotal
        });
      }
    }

    // --- Coupon Logic ---
    let discountAmount = 0;
    let appliedCouponId = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
         const currentDate = new Date();
         if(currentDate >= new Date(coupon.validFrom) && currentDate <= new Date(coupon.validTo)) {
             if (coupon.discountType === 'percentage') {
                 discountAmount = (subTotal * coupon.discountValue) / 100;
                 if(coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
             } else {
                 discountAmount = coupon.discountValue;
             }
             appliedCouponId = coupon._id;
         }
      }
    }

    if (discountAmount > subTotal) discountAmount = subTotal;

    // --- Final Amounts ---
    const taxAmount = Math.round(subTotal * 0.05); 
    const finalAmount = Math.round((subTotal - discountAmount) + taxAmount);
    
    // ✅ FIX: Convert to lowercase to match Model Enum
    const paymentMethodLower = paymentMethod.toLowerCase(); 

    // --- Prepare Order Data ---
    const orderData = {
      orderNumber: generateOrderNumber(),
      userId: type === 'user' ? id : null,
      sessionToken: type === 'session' ? id : null,
      items: orderItems,
      billDetails: { subTotal, discountAmount, taxAmount, finalAmount },
      
      tableNumber: Number(tableNumber), // Ensure it's a Number
      customerName, 
      customerPhone, 
      customerEmail, 
      notes,
      
      paymentMethod: paymentMethodLower, 
      paymentStatus: 'pending', // lowercase
      orderStatus: 'pending',   // lowercase
      
      couponCode: appliedCouponId ? couponCode : null,
    };

    // === CASE A: CASH ===
    if (paymentMethodLower === 'cash') {
        const newOrder = await Order.create(orderData);
        await handlePostOrderActions(req, newOrder, cart, appliedCouponId, tableNumber, type, id, finalAmount);
        
        return SuccessResponse(res, 201, newOrder, "Order Placed Successfully");
    }

    // === CASE B: RAZORPAY ===
    else if (paymentMethodLower === 'razorpay') {
        if (!razorpay) return ErrorResponse(res, 500, "Online payment system is down. Please use Cash.");

        const options = {
            amount: finalAmount * 100, 
            currency: "INR",
            receipt: orderData.orderNumber,
            notes: { customerPhone }
        };

        const razorpayOrder = await razorpay.orders.create(options);
        
        orderData.razorPayOrderId = razorpayOrder.id;
        const newOrder = await Order.create(orderData);

        await handlePostOrderActions(req, newOrder, cart, appliedCouponId, tableNumber, type, id, finalAmount);

        // Send Key to frontend
        const keyId = process.env.RAZORPAY_API_KEY || process.env.RAZORPAY_KEY_ID;

        return SuccessResponse(res, 201, {
            order: newOrder,
            razorPayDetails: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: keyId 
            }
        }, "Proceed to Payment");
    } else {
        return ErrorResponse(res, 400, "Invalid Payment Method");
    }

  } catch (error) {
    console.error("Place Order Error:", error);
    next(error);
  }
};

// --- Helper Actions ---
const handlePostOrderActions = async (req, order, cart, couponId, tableNum, userType, userId, amount) => {
    if (couponId) await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });

    if (tableNum) {
        const ownerId = userType === 'user' ? userId : req.identity.id;
        await Table.findOneAndUpdate(
            { tableNumber: tableNum }, 
            { isOccupied: true, currentOwner: ownerId }
        );
    }

    try {
        const io = req.app.get('io');
        if(io) io.emit('order', { type: 'NEW_ORDER', data: order });
    } catch (err) { }

    cart.items = [];
    cart.totalCartPrice = 0;
    await cart.save();
    
    if (userType === 'user') {
        try {
            await myModel.findByIdAndUpdate(userId, { $inc: { totalOrders: 1, totalSpend: amount } });
        } catch(e) {}
    }
};

// ==========================================
// 3. OTHER CONTROLLERS
// ==========================================

export const verifyPayment = async (req, res, next) => {
    try {
        const { razorPayOrderId, razorPayPaymentId, razorPaySignature } = req.body;
        const order = await Order.findOne({ razorPayOrderId });
        if (!order) return ErrorResponse(res, 404, "Order not found");

        const secret = process.env.RAZORPAY_API_SECRET || process.env.RAZORPAY_KEY_SECRET;

        const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(razorPayOrderId + '|' + razorPayPaymentId)
        .digest('hex');

        if (generated_signature !== razorPaySignature) {
            order.paymentStatus = 'failed';
            await order.save();
            return ErrorResponse(res, 400, "Payment verification failed");
        }

        order.paymentStatus = 'success';
        order.razorPayPaymentId = razorPayPaymentId;
        order.razorPaySignature = razorPaySignature;
        await order.save();

        const io = req.app.get('io');
        if(io) io.emit('order', { type: 'PAYMENT_SUCCESS', orderId: order._id });

        return SuccessResponse(res, 200, order, "Payment Verified Successfully");
    } catch (error) { next(error); }
};

export const getAdminStats = async (req, res, next) => {
    try {
        const revenueData = await Order.aggregate([
            { $match: { paymentStatus: "success" } },
            { $group: { _id: null, total: { $sum: "$billDetails.finalAmount" } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });
        const completedOrders = await Order.countDocuments({ orderStatus: "served" });
        const activeTables = await Table.countDocuments({ isOccupied: true }); 
        const totalMenu = await Menu.countDocuments(); 
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

        res.status(200).json({
            success: true,
            stats: { totalRevenue, totalOrders, pendingOrders, completedOrders, activeTables, totalMenu, recentOrders }
        });
    } catch (error) { next(error); }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body; 
        const order = await Order.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });
        if (!order) return ErrorResponse(res, 404, "Order not found");
        const io = req.app.get('io');
        if(io) io.emit('orderStatusUpdate', { orderId, status });
        res.status(200).json({ success: true, message: "Order status updated", order });
    } catch (error) { next(error); }
};

export const markOrderAsPaid = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({ message: "Order not found" });
        
        order.paymentStatus = 'success'; // ✅ Correct Enum
        await order.save();
        return res.status(200).json({ success: true, message: "Payment Verified" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate('items.menuItemId');
        res.status(200).json({ success: true, orders });
    } catch (error) { next(error); }
};

export const getMyOrders = async (req, res, next) => {
    try {
        const { type, id } = req.identity; 
        let query = type === 'user' ? { userId: id } : { sessionToken: id };
        const orders = await Order.find(query).sort({ createdAt: -1 }).populate('items.menuItemId'); 
        return res.status(200).json({ success: true, orders });
    } catch (error) { next(error); }
};

// Backwards compatibility alias
export const createOrder = placeOrder;