import express from 'express';
import { createMenu, deleteMenu, getmenuCategory, updateMenu } from '../controller/menuController.js';
// Multer middleware import (Make sure path is correct)
import upload from '../middleware/upload.js'; 

const router = express.Router();

// ✅ FIX: 'myimage' -> 'image' (Frontend se match hona chahiye)
router.post("/", upload.single('image'), createMenu);

router.get("/", getmenuCategory);

// ✅ FIX: 'myimage' -> 'image'
router.put("/:id", upload.single('image'), updateMenu);

router.delete("/:id", deleteMenu);

export default router;