import express from 'express'
import verify from '../middleware/verify';
import checkRole from '../middleware/checkRole';

const router = express.Router();


// get all users // token user login => verify token, aadmin

router.get("/user", verify, checkRole(["admin"]), )

export default router 

