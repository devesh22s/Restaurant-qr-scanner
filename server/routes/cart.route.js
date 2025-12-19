import express from 'express' ;
import { addToCart, decreaseItem, getCart, increaseItem, removeItemCart } from '../controller/cartController.js';

const router = express.Router() ;


router.post('/addtocart', addToCart)
router.get('/cart/:userId', getCart);
router.delete('/remove', removeItemCart);
router.patch("/cart/increase",increaseItem);
router.patch("/cart/decrease",decreaseItem);





export default router