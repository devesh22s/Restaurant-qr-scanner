import { login, refreshToken, register, resetPassword, searchAccount, sendOtp, googleAuth } from '../controller/authController.js';
import express from 'express'
import SessionTokenVerfiy from '../middleware/SessionTokenVerify.js';
const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/search", searchAccount)

// forget password api for sending mail to user
router.post('/refresh-token', refreshToken);

//  forget password
router.post('/send-otp', sendOtp);
router.post('/reset-password', resetPassword);
// convert guest into user
router.post('/convert', SessionTokenVerfiy, (req, res)=>{
    console.log("hello");
    
})

router.post('/google', googleAuth);

export default router