import crypto from 'crypto';
import Razorpay from "razorpay";
import Order from "../model/order.js";
import Cart from "../model/cart.js";
import Coupon from "../model/coupon.js"; 
import Menu from "../model/menu.js"; // ✅ Essential Import
import myModel from "../model/User.js";
import Table from "../model/table.js"; // ✅ Essential Import
import { SuccessResponse, ErrorResponse } from "../utils/responseWrapper.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

const generateOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// ==========================================
// 1. CREATE ORDER API
// ==========================================
export const createOrder = async (req, res, next) => {
  try {
    const { 
      couponCode, paymentMethod, tableNumber, 
      customerName, customerPhone, customerEmail, notes 
    } = req.body;

    const { type, id } = req.identity;

    // --- 1. Fetch Cart ---
    let query = type === 'user' ? { userId: id } : { sessionToken: id };
    const cart = await Cart.findOne(query);

    if (!cart || cart.items.length === 0) {
      return ErrorResponse(res, 400, "Cart is empty");
    }

    // --- 2. Calculate Subtotal ---
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

    // --- 3. Coupon Logic (Fixed) ---
    let discountAmount = 0;
    let appliedCouponId = null;

    if (couponCode && couponCode.trim() !== "") {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      
      console.log("Applying Coupon:", couponCode);

      if (coupon) {
         const currentDate = new Date();
         const isValidDate = currentDate >= new Date(coupon.validFrom) && currentDate <= new Date(coupon.validTo);
         
         // ✅ FIX: Handle undefined minOrderAmount
         const minOrder = coupon.minOrderAmount || 0;
         const isMinOrderMet = subTotal >= minOrder;
         
         const isUsageLimitReached = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

         if (!isValidDate) return ErrorResponse(res, 400, "Coupon Expired");
         if (!isMinOrderMet) return ErrorResponse(res, 400, `Minimum order of ₹${minOrder} required`);
         if (isUsageLimitReached) return ErrorResponse(res, 400, "Coupon usage limit reached");

         // Valid Coupon
         appliedCouponId = coupon._id;
         if (coupon.discountType === 'percentage') {
             discountAmount = (subTotal * coupon.discountValue) / 100;
             if(coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
         } else {
             discountAmount = coupon.discountValue;
         }
      } else {
          return ErrorResponse(res, 400, "Invalid Coupon Code");
      }
    }

    // Discount shouldn't exceed subtotal
    if (discountAmount > subTotal) discountAmount = subTotal;

    // --- 4. Final Calculation ---
    const taxAmount = Math.round(subTotal * 0.05); // 5% GST
    const finalAmount = Math.round((subTotal - discountAmount) + taxAmount);
    
    console.log(`Sub: ${subTotal}, Disc: ${discountAmount}, Tax: ${taxAmount}, Final: ${finalAmount}`);

    const orderNumber = generateOrderNumber();
    
    const orderData = {
      orderNumber,
      userId: type === 'user' ? id : null,
      sessionToken: type === 'session' ? id : null,
      items: orderItems,
      billDetails: { subTotal, discountAmount, taxAmount, finalAmount },
      couponCode: appliedCouponId ? couponCode : null,
      tableNumber,
      customerName, customerEmail, customerPhone, notes,
      paymentMethod,
      orderStatus: 'pending',
      paymentStatus: 'pending' 
    };

    // --- 5. Payment Processing ---
    
    // === CASE A: CASH ===
    if (paymentMethod === 'cash') {
        const newOrder = await Order.create(orderData);
        await handlePostOrderActions(req, newOrder, cart, appliedCouponId, tableNumber, type, id, finalAmount);
        return SuccessResponse(res, 201, newOrder, "Order Placed Successfully");
    }

    // === CASE B: RAZORPAY ===
    else if (paymentMethod === 'razorpay') {
        const options = {
            amount: finalAmount * 100, // ✅ Send Correct Amount (in paise)
            currency: "INR",
            receipt: orderNumber,
            notes: { customerEmail, customerPhone }
        };

        const razorpayOrder = await razorpay.orders.create(options);
        
        orderData.razorPayOrderId = razorpayOrder.id;
        const newOrder = await Order.create(orderData);

        await handlePostOrderActions(req, newOrder, cart, appliedCouponId, tableNumber, type, id, finalAmount);

        return SuccessResponse(res, 201, {
            order: newOrder,
            razorPayDetails: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_API_KEY 
            }
        }, "Proceed to Payment");
    }

  } catch (error) {
    next(error);
  }
};

// Helper: Actions after order creation
const handlePostOrderActions = async (req, order, cart, couponId, tableNum, userType, userId, amount) => {
    // 1. Update Coupon Usage
    if (couponId) {
        await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
    }

    // 2. Mark Table Occupied & Set Owner
    if (tableNum) {
        // ✅ FIX: Set currentOwner (userId or sessionToken)
        const ownerId = userType === 'user' ? userId : req.identity.id;
        await Table.findOneAndUpdate(
            { tableNumber: tableNum }, 
            { isOccupied: true, currentOwner: ownerId }
        );
    }

    // 3. Notify Kitchen
    try {
        const io = req.app.get('io');
        if(io) io.emit('order', { type: 'NEW_ORDER', data: order });
    } catch (err) { console.log("Socket Error:", err); }

    // 4. Clear Cart
    cart.items = [];
    cart.totalCartPrice = 0;
    await cart.save();

    // 5. Update User Stats
    if (userType === 'user') {
        try {
            await myModel.findByIdAndUpdate(userId, { $inc: { totalOrders: 1, totalSpend: amount } });
        } catch (err) {}
    }
};

// ==========================================
// 2. VERIFY PAYMENT API
// ==========================================
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorPayOrderId, razorPayPaymentId, razorPaySignature } = req.body;
    const order = await Order.findOne({ razorPayOrderId });
    if (!order) return ErrorResponse(res, 404, "Order not found");

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
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

// ==========================================
// ADMIN: DASHBOARD STATS (Fixed)
// ==========================================
export const getAdminStats = async (req, res, next) => {
  try {
    // 1. Revenue
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: "success" } },
      { $group: { _id: null, total: { $sum: "$billDetails.finalAmount" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // 2. Counts
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });
    const completedOrders = await Order.countDocuments({ orderStatus: "served" });
    
    // 3. Active Tables
    const activeTables = await Table.countDocuments({ isOccupied: true }); 

    // ✅ FIX: Define totalMenu properly
    const totalMenu = await Menu.countDocuments(); 

    // 5. Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderNumber customerName tableNumber billDetails.finalAmount orderStatus createdAt");

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        completedOrders,
        activeTables,
        totalMenu, // ✅ Ab ye defined hai
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

// ... (getMyOrders, getAllOrders, updateOrderStatus are same as before - keep them) ...
export const getMyOrders = async (req, res, next) => {
  try {
    const { type, id } = req.identity; 
    let query = type === 'user' ? { userId: id } : { sessionToken: id };
    const orders = await Order.find(query).sort({ createdAt: -1 }).populate('items.menuItemId'); 
    return res.status(200).json({ success: true, orders });
  } catch (error) { next(error); }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('items.menuItemId');
    res.status(200).json({ success: true, orders });
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

// ----------- payment handling

// 1. PLACE ORDER (Modified for Cash)
export const placeOrder = async (req, res) => {
  try {
    const { paymentMethod } = req.body; // 'Cash' or 'r'
    const { type, id } = req.identity;

    // Cart Find Karo
    let query = type === 'user' ? { userId: id } : { sessionToken: id };
    const cart = await Cart.findOne(query).populate("items.menuItemId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Order Data Prepare Karo
    const orderItems = cart.items.map(item => ({
        menuItemId: item.menuItemId._id,
        name: item.menuItemId.name,
        price: item.menuItemId.price,
        quantity: item.quantity
    }));

    // ✅ CASE 1: CASH PAYMENT
    if (paymentMethod === 'Cash') {
        const newOrder = await Order.create({
            userId: type === 'user' ? id : null,
            sessionToken: type === 'session' ? id : null,
            items: orderItems,
            totalAmount: cart.totalCartPrice,
            paymentMethod: 'Cash',
            paymentStatus: 'Pending', // Paisa abhi nahi mila
            orderStatus: 'Placed'
        });

        // Cart Clear kardo
        await Cart.findOneAndDelete(query);

        return res.status(201).json({ 
            success: true, 
            message: "Order placed successfully! Please pay at counter.", 
            orderId: newOrder._id 
        });
    }

    // ✅ CASE 2: ONLINE PAYMENT (Stripe logic here later...)
    // return res.status(200).json({ message: "Redirect to Payment Gateway" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Order Failed" });
  }
};

// 2. MARK AS PAID (Admin Only API)
export const markOrderAsPaid = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({ message: "Order not found" });

        order.paymentStatus = 'Paid';
        await order.save();

        return res.status(200).json({ success: true, message: "Payment Verified" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}