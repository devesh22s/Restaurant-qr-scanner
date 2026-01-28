import express from 'express';
import { createTable, getAllTable, getTableBySlug, deleteTable, freeTable } from '../controller/tableController.js';
// Middleware imports ensure karein
import verify from '../middleware/verify.js'; // ya identifyUser
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

// 1. Create Table (Admin Only)
router.post("/", verify, checkRole(["admin"]), createTable);

// 2. Get All Tables (Admin Only)
router.get("/", getAllTable);

// 3. Delete Table (Admin Only) - ✅ NEW
router.delete("/:id", verify, checkRole(["admin"]), deleteTable);

// 4. admin clear the table
router.put("/:id/free", verify, checkRole(["admin"]), freeTable);

// 5. Get Table by Slug (Public/Guest)
router.get("/slug/:slug", getTableBySlug);

export default router;