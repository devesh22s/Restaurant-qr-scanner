import express from 'express';
import { 
    placeOrder, // Unified function
    verifyPayment, getMyOrders, getAdminStats, getAllOrders, 
    updateOrderStatus, markOrderAsPaid 
} from '../controller/orderController.js';
import identifyUser from '../middleware/identifyUser.js';
import checkRole from '../middleware/checkRole.js'; 

const router = express.Router();

// --- CUSTOMER ROUTES ---
// ✅ Main Order Route (Cash + Online)
router.post('/place', identifyUser, placeOrder); 

router.post('/verify-payment', identifyUser, verifyPayment);
router.get('/myorders', identifyUser, getMyOrders);

// --- ADMIN ROUTES ---
router.get('/admin/stats', identifyUser, checkRole(['admin']), getAdminStats);
router.get('/admin/all-orders', identifyUser, checkRole(['admin']), getAllOrders);
router.put('/admin/update-status/:orderId', identifyUser, checkRole(['admin']), updateOrderStatus);
router.post('/admin/mark-paid', identifyUser, checkRole(['admin']), markOrderAsPaid);

export default router;