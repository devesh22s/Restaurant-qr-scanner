import express from 'express';
import { createOrder } from '../controllers/order.controller.js';
import checkGuestOrUser from '../middlewares/checkGuestAndUser.js';
const router = express.Router();

router.post('/orders', checkGuestOrUser, createOrder);

export default router;