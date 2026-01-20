import express from 'express';
import { createMenu, deleteMenu, getmenuCategory, updateMenu } from '../controller/menuController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// NOTE: index.js mein already '/api/v1/menu' set hai.
// Isliye yahan hum sirf '/' use karenge.

// Create Menu -> POST /api/v1/menu/
router.post("/", upload.single('myimage'), createMenu);

// Get All Menu -> GET /api/v1/menu/
router.get("/", getmenuCategory);

// Update Menu -> PUT /api/v1/menu/:id
router.put("/:id", upload.single('myimage'), updateMenu);

// Delete Menu -> DELETE /api/v1/menu/:id
router.delete("/:id", deleteMenu);

export default router;