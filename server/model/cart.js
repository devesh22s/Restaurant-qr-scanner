import mongoose from 'mongoose';

const cartScehma = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }, //comes from ui
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu', //comes from ui
      },
      quantity: {
        type: Number,
    
      }, //comes from ui
    },
  ],
  totalCartPrice: {
    type: Number,
  }, //calculate from backend
});

const Cart = mongoose.model('Cart', cartScehma);

export default Cart;