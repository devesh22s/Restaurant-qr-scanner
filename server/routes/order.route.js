import express from 'express';
import { createOrder, verifyPayment } from '../controller/orderController.js';
import identifyUser from '../middleware/identifyUser.js';
const router = express.Router();

router.post('/orders', identifyUser, createOrder);
router.post('/verify-payment', identifyUser, verifyPayment);

export default router;