import express from 'express';
import { createOrder } from '../controller/orderController.js';
import checkGuestAndUser from '../middleware/checkGuestAndUser.js';
const router = express.Router();

router.post('/orders', checkGuestAndUser, createOrder);

export default router;