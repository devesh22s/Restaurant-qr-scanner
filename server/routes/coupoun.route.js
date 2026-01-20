import express from 'express' ;
import { getAllCoupouns, registerCoupan } from '../controller/coupounController.js';

const router = express.Router() ;


router.get('/coupouns', getAllCoupouns)
router.get('/coupouns', registerCoupan)

export default router