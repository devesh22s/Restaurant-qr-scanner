import { login, register, searchAccount } from '../controller/authController.js';
import express from 'express'
import SessionTokenVerfiy from '../middleware/SessionTokenVerify.js';
const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/search-account", searchAccount)

// forget password api for sending mail to user



// convert guest into user
router.post('/convert', SessionTokenVerfiy, (req, res)=>{
    console.log("hello");
    
})

export default router