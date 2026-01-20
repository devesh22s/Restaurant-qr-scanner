import express from 'express';
import { addToCart, decreaseItem, getCart, increaseItem, removeItemCart } from '../controller/cartController.js';
import identifyUser from '../middleware/identifyUser.js';

const router = express.Router();

// Base URL: /api/v1/cart

router.post('/add', identifyUser, addToCart); // Changed from 'addtocart' to 'add'
router.get('/my-cart', identifyUser, getCart); // Changed from '/cart/:userId' to '/my-cart'
router.delete('/remove', identifyUser, removeItemCart); // Added identifyUser
router.patch('/increase', identifyUser, increaseItem); // Added identifyUser
router.patch('/decrease', identifyUser, decreaseItem); // Added identifyUser

export default router;