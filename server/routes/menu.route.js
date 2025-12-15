import express from 'express'
import { createMenu, deleteMenu, getmenuCategory, updateMenu  } from '../controller/menuController.js';

import upload from '../middleware/upload.js';
const router = express.Router();

router.post("/menu", upload.single('myimage'), createMenu)
router.get("/menu", getmenuCategory)
router.put("/menu/:id", upload.single('myimage'), updateMenu)
router.delete("/menu/:id", deleteMenu)
export default router