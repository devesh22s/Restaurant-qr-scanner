import crypto from 'crypto';
import Order from "../model/order.js";
import Cart from "../model/cart.js";
import Coupon from "../model/coupon.js"; 
import Menu from "../model/menu.js";
import myModel from "../model/User.js";
import razorpay from "../config/razorpay.js"; 
import Table from "../model/table.js";
import { SuccessResponse, ErrorResponse } from "../utils/responseWrapper.js";

// Helper: Calculate Order Number
const generateOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// ==========================================
// 1. CREATE ORDER API (Logic for Cash & Razorpay)
// ==========================================
export const createOrder = async (req, res, next) => {
  try {
    const { 
      couponCode, paymentMethod, tableNumber, 
      customerName, customerPhone, customerEmail, notes 
    } = req.body;

    // Middleware se identity mili (User ya Guest)
    const { type, id } = req.identity;

    // --- STEP 1: Fetch Cart ---
    let query = type === 'user' ? { userId: id } : { sessionToken: id };
    const cart = await Cart.findOne(query);

    if (!cart || cart.items.length === 0) {
      return ErrorResponse(res, 400, "Cart is empty");
    }

    // --- STEP 2: Server-Side Price Calculation (Secure) ---
    let subTotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const menu = await Menu.findById(item.menuItemId);
      if (!menu) continue; 
      
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

    // --- STEP 3: Apply Coupon ---
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
         // Check constraints (Date & Min Order)
         const isValidDate = new Date() >= coupon.validFrom && new Date() <= coupon.validTo;
         const isMinOrderMet = subTotal >= coupon.minOrderAmount;

         if(isValidDate && isMinOrderMet) {
             if (coupon.discountType === 'percentage') {
                 discountAmount = (subTotal * coupon.discountValue) / 100;
                 if(coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
             } else {
                 discountAmount = coupon.discountValue;
             }
         }
      }
    }

    // --- STEP 4: Final Bill Calculation ---
    const taxAmount = Math.round(subTotal * 0.05); // 5% GST
    const finalAmount = Math.round(subTotal - discountAmount + taxAmount);
    const orderNumber = generateOrderNumber();
    
    // --- STEP 5: Prepare Order Data ---
    const orderData = {
      orderNumber,
      userId: type === 'user' ? id : null,
      sessionToken: type === 'session' ? id : null,
      items: orderItems,
      billDetails: { subTotal, discountAmount, taxAmount, finalAmount },
      couponCode: couponCode || null,
      tableNumber,
      customerName, customerEmail, customerPhone, notes,
      paymentMethod,
      orderStatus: 'pending',
      paymentStatus: 'pending' 
    };

    // --- STEP 6: Handle Payment Gateways ---
    
    // === CASE A: CASH Order ===
    if (paymentMethod === 'cash') {
        const newOrder = await Order.create(orderData);
        
        // Notify Kitchen (Socket.io)
        try {
            const io = req.app.get('io');
            if(io) io.emit('order', { type: 'NEW_ORDER', data: newOrder });
        } catch (err) { console.log("Socket emit failed", err); }

        // Clear Cart & Update Stats
        await clearCartAndUpdateStats(cart, type, id, finalAmount);

        return SuccessResponse(res, 201, newOrder, "Order Placed Successfully");
    }

    // === CASE B: RAZORPAY Order ===
    else if (paymentMethod === 'razorpay') {
        const options = {
            amount: finalAmount * 100, // Razorpay takes amount in paise
            currency: "INR",
            receipt: orderNumber,
            notes: { customerEmail, customerPhone }
        };

        // Create order on Razorpay Server
        const razorpayOrder = await razorpay.orders.create(options);
        
        // Save to our DB with RP Order ID
        orderData.razorPayOrderId = razorpayOrder.id;
        const newOrder = await Order.create(orderData);

        // Clear Cart (Assuming user will pay, we clear logic here or after success)
        await clearCartAndUpdateStats(cart, type, id, finalAmount);

        return SuccessResponse(res, 201, {
            order: newOrder,
            razorPayDetails: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_API_KEY // Send Key to frontend
            }
        }, "Proceed to Payment");
    }

  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. VERIFY PAYMENT API (Called after Razorpay Popup)
// ==========================================
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorPayOrderId, razorPayPaymentId, razorPaySignature } = req.body;

    const order = await Order.findOne({ razorPayOrderId });
    if (!order) {
        return ErrorResponse(res, 404, "Order not found");
    }

    // Razorpay Signature Verification Formula
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(razorPayOrderId + '|' + razorPayPaymentId)
      .digest('hex');

    if (generated_signature !== razorPaySignature) {
        order.paymentStatus = 'failed';
        await order.save();
        return ErrorResponse(res, 400, "Payment verification failed");
    }

    // Payment Successful
    order.paymentStatus = 'success';
    order.razorPayPaymentId = razorPayPaymentId;
    order.razorPaySignature = razorPaySignature;
    await order.save();

    // Notify Kitchen that Payment is Done
    try {
        const io = req.app.get('io');
        if(io) io.emit('order', { type: 'PAYMENT_SUCCESS', orderId: order._id });
    } catch (err) { console.log("Socket error", err); }

    return SuccessResponse(res, 200, order, "Payment Verified Successfully");

  } catch (error) {
    next(error);
  }
};


// ===============================================
//3.  GET MY ORDERS
// ===================================================
export const getMyOrders = async (req, res, next) => {
  try {
    const { type, id } = req.identity; // Middleware se identity

    // Query based on User ID or Guest Session
    let query = type === 'user' ? { userId: id } : { sessionToken: id };

    // Find orders, sort by latest first
    const orders = await Order.find(query)
      .sort({ createdAt: -1 }) // Newest top
      .populate('items.menuItemId'); // Item details fetch karo

    return res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    next(error);
  }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================
const clearCartAndUpdateStats = async (cart, type, userId, amount) => {
    // 1. Clear Cart
    cart.items = [];
    cart.totalCartPrice = 0;
    await cart.save();

    // 2. Update User Stats (if registered user)
    if (type === 'user') {
        await myModel.findByIdAndUpdate(userId, { 
            $inc: { totalOrders: 1, totalSpend: amount } 
        });
    }
};



// ================================================

// GET ADMIN DASHBOARD STATS
export const getAdminStats = async (req, res, next) => {
  try {
    // 1. Total Revenue (Sabhi orders ka sum jinka payment success hai)
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: "success" } },
      { $group: { _id: null, total: { $sum: "$billDetails.finalAmount" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // 2. Counts
    const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });
    const completedOrders = await Order.countDocuments({ orderStatus: "served" });
    
    // 3. Active Tables (Jahan koi session active hai)
    // Note: Iske liye Table model me 'isOccupied' flag hona chahiye, abhi ke liye dummy logic ya Order based logic
    const activeTables = await Order.countDocuments({ orderStatus: { $in: ['pending', 'preparing', 'ready'] } });

    // 4. Recent Orders (Top 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderNumber customerName tableNumber billDetails.finalAmount orderStatus createdAt");

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        pendingOrders,
        completedOrders,
        activeTables,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};



// =================================================
// 1. GET ALL ORDERS (ADMIN ONLY)
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 }) // Latest first
      .populate('items.menuItemId'); // Item details bhi chahiye

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// 2. UPDATE ORDER STATUS (ADMIN ONLY)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // e.g., 'preparing', 'ready', 'served'

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return ErrorResponse(res, 404, "Order not found");
    }

    // Optional: Notify Kitchen/User via Socket here
    // const io = req.app.get('io');
    // io.emit('orderStatusUpdate', { orderId, status });

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order
    });
  } catch (error) {
    next(error);
  }
};