import express from 'express';
import { 
    createOrder, verifyPayment, getMyOrders, getAdminStats, 
    getAllOrders, updateOrderStatus // ✅ Import new functions
} from '../controller/orderController.js';
import identifyUser from '../middleware/identifyUser.js';
import checkRole from '../middleware/checkRole.js'; // ✅ Admin Check Middleware

const router = express.Router();

router.post('/orders', identifyUser, createOrder);
router.post('/verify-payment', identifyUser, verifyPayment);
router.get('/myorders', identifyUser, getMyOrders);

// --- ADMIN ROUTES ---
router.get('/admin/stats', identifyUser, getAdminStats);

// ✅ New: Get All Orders
router.get('/admin/all-orders', identifyUser, checkRole(['admin']), getAllOrders);

// ✅ New: Update Status
router.put('/admin/update-status/:orderId', identifyUser, checkRole(['admin']), updateOrderStatus);

export default router;