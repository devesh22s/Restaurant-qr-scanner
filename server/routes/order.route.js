import express from 'express';
import { createOrder } from '../controller/orderController.js';
import identifyUser from '../middleware/identifyUser.js';
const router = express.Router();

router.post('/orders', identifyUser, createOrder);

export default router;