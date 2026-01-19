import express from 'express' ;
import { addToCart, decreaseItem, getCart, increaseItem, removeItemCart } from '../controller/cartController.js';
import identifyUser from '../middleware/identifyUser.js';

const router = express.Router() ;


router.post('/addtocart',identifyUser, addToCart)
router.get('/cart/:userId',identifyUser, getCart);
router.delete('/remove', removeItemCart);
router.patch("/cart/increase",increaseItem);
router.patch("/cart/decrease",decreaseItem);





export default router