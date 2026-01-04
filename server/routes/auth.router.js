import { login, register, searchAccount } from '../controller/authController.js';
import express from 'express'
const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/search-account", searchAccount)

// forget password api for sending mail to user


export default router