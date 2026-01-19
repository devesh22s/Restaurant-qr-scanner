import Order from "../model/order.js";
import Cart from "../model/cart.js";
import Coupon from "../model/coupon.js"; // Spelling Fixed
import Menu from "../model/menu.js";
import myModel from "../model/User.js";
import { SuccessResponse, ErrorResponse } from "../utils/responseWrapper.js";

// Helper: Calculate Order Number
const generateOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const createOrder = async (req, res, next) => {
  try {
    const { 
      couponCode, paymentMethod, tableNumber, 
      customerName, customerPhone, customerEmail, notes 
    } = req.body;

    // Middleware se identity mili (User ya Guest)
    const { type, id } = req.identity;

    // 1. Fetch Cart
    let query = type === 'user' ? { userId: id } : { sessionToken: id };
    const cart = await Cart.findOne(query);

    if (!cart || cart.items.length === 0) {
      return ErrorResponse(res, 400, "Cart is empty");
    }

    // 2. Server-Side Price Calculation
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

    // 3. Apply Coupon
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
         // Add detailed validation (Expiry, Min Order) here if needed
         if (coupon.discountType === 'percentage') {
             discountAmount = (subTotal * coupon.discountValue) / 100;
             if(coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
         } else {
             discountAmount = coupon.discountValue;
         }
      }
    }

    // 4. Final Bill
    const taxAmount = Math.round(subTotal * 0.05); // 5% GST
    const finalAmount = Math.round(subTotal - discountAmount + taxAmount);
    
    // 5. Create Order
    const newOrder = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: type === 'user' ? id : null,
      sessionToken: type === 'session' ? id : null,
      items: orderItems,
      billDetails: { subTotal, discountAmount, taxAmount, finalAmount },
      couponCode,
      tableNumber,
      customerName, customerEmail, customerPhone, notes,
      paymentMethod,
      orderStatus: 'pending',
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending' // Update to 'success' if online paid
    });

    // 6. Clear Cart
    cart.items = [];
    cart.totalCartPrice = 0;
    await cart.save();

    // 7. Update User Stats (If registered)
    if (type === 'user') {
       await myModel.findByIdAndUpdate(id, { 
           $inc: { totalOrders: 1, totalSpend: finalAmount } 
       });
    }

    // Response using your utility
    return SuccessResponse(res, 201, newOrder, "Order Placed Successfully");

  } catch (error) {
    next(error);
  }
};