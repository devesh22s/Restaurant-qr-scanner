import express from 'express';
import { 
    createCoupon, 
    getAdminCoupons, 
    deleteCoupon,
    verifyCoupon // ✅ Import this
} from '../controller/coupounController.js';

const router = express.Router();

// --- ADMIN ROUTES ---
router.post('/create', createCoupon);
router.get('/all', getAdminCoupons);
router.delete('/:id', deleteCoupon);

// --- CUSTOMER ROUTE (Checkout Page Call karega) ---
router.post('/verify', verifyCoupon); 

export default router;