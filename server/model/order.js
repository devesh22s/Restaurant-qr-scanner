import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  
  // Link to User OR Guest Session
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sessionToken: { type: String, default: null },

  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
      name: String,
      price: Number,
      quantity: Number,
      subTotal: Number, // Price * Qty
    },
  ],
  
  billDetails: {
    subTotal: Number,
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 }, // GST
    finalAmount: Number,
  },

  couponCode: { type: String, default: null },
  
  // Customer Info (Guest bharega checkout pe)
  tableNumber: { type: Number, required: true },
  customerName: { type: String },
  customerPhone: { type: String },
  customerEmail: { type: String },
  
  orderStatus: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  paymentMethod: { type: String, enum: ['cash', 'razorpay'], required: true },
  
  razorPayOrderId: String,
  razorPayPaymentId: String,
}, { timestamps: true });

// ✅ OPTIMIZATION: Queries ko milliseconds mein laane ke liye Indexes
orderSchema.index({ paymentStatus: 1 }); 
orderSchema.index({ orderStatus: 1, createdAt: -1 }); 
orderSchema.index({ userId: 1, sessionToken: 1 }); 

const Order = mongoose.model('Order', orderSchema);
export default Order;