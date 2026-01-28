import express from 'express';
import { createTable, getAllTable, getTableBySlug, deleteTable, freeTable } from '../controller/tableController.js';
import verify from '../middleware/verify.js'; 
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

// 1. Create (Admin)
router.post("/", verify, checkRole(["admin"]), createTable);

// 2. Get All
router.get("/", getAllTable);

// 3. Delete (Admin)
router.delete("/:id", verify, checkRole(["admin"]), deleteTable);

// 4. Free Table (Admin)
router.put("/:id/free", verify, checkRole(["admin"]), freeTable);

// ✅ 5. Verify QR (Iska URL frontend se match hona chahiye)
router.get("/slug/:slug", getTableBySlug);

export default router;