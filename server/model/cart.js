import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  // Hybrid Identification: Ya toh User hoga ya Session (Guest)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sessionToken: {
    type: String,
    default: null
  },
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
    },
  ],
  totalCartPrice: {
    type: Number,
    default: 0
  }, 
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;