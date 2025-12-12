import express from 'express' ;
import { addToCart } from '../controller/cartController.js';

const router = express.Router() ;


router.post('/addtocart', addToCart)

export default router