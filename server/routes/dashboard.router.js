import express from 'express';
import { getDashboardStats } from '../controller/dashboardController.js';
import verify from '../middleware/verify.js'; // Your auth middleware
import checkRole from '../middleware/checkRole.js'; // Your role middleware

const router = express.Router();

// Only Admin can access
router.get('/stats', verify, checkRole(['admin']), getDashboardStats);

export default router;