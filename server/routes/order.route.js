import express from 'express';
import { createOrder, getMyOrders, verifyPayment } from '../controller/orderController.js';
import identifyUser from '../middleware/identifyUser.js';
const router = express.Router();

router.post('/orders', identifyUser, createOrder);
router.post('/verify-payment', identifyUser, verifyPayment);

router.get('/myorders', identifyUser, getMyOrders);

export default router;