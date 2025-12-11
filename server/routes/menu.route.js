import { login, register } from '../controller/authController.js';
import express from 'express'
import { createMenu } from '../controller/menuController.js';
import { verify } from 'crypto';
import checkRole from '../middleware/checkRole.js';
import upload from '../middleware/upload.js';
const router = express.Router();

router.post("/menu", upload.single('myimage'), createMenu)
export default router