import express from 'express';
import { 
    createOrder, verifyPayment, getMyOrders, getAdminStats, 
    getAllOrders, updateOrderStatus, 
    placeOrder,
    markOrderAsPaid
} from '../controller/orderController.js';
import identifyUser from '../middleware/identifyUser.js';
import checkRole from '../middleware/checkRole.js'; 

const router = express.Router();

// --- CUSTOMER ROUTES ---
router.post('/orders', identifyUser, createOrder);
router.post('/verify-payment', identifyUser, verifyPayment);
router.get('/myorders', identifyUser, getMyOrders);

// --- ADMIN ROUTES (Protected) ---

router.get('/admin/stats', identifyUser, checkRole(['admin']), getAdminStats);

// Get All Orders
router.get('/admin/all-orders', identifyUser, checkRole(['admin']), getAllOrders);

// Update Status
router.put('/admin/update-status/:orderId', identifyUser, checkRole(['admin']), updateOrderStatus);

// payment
router.post('/place', identifyUser, placeOrder);
// Admin Route (Cash Payment Receive karne ke liye)
router.post('/admin/mark-paid', identifyUser, checkRole(['admin']), markOrderAsPaid);

export default router;