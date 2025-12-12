import express from 'express'
import { createMenu, menuCategory  } from '../controller/menuController.js';

import upload from '../middleware/upload.js';
const router = express.Router();

router.post("/menu", upload.single('myimage'), createMenu)
router.get("/menu", menuCategory)
export default router