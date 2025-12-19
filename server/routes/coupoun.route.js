import express from 'express' ;
import { getAllCoupouns, registrationCoupoun } from '../controller/coupounController.js';

const router = express.Router() ;


router.get('/coupouns', getAllCoupouns)
router.get('/coupouns', registrationCoupoun)

export default router