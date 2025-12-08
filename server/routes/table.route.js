import express from 'express'
import  {createTable, getAllTable, getTableBySlug}  from '../controller/tableController.js';
import verify from '../middleware/verify.js';
import checkRole from '../middleware/checkRole.js';
const router = express.Router();

router.post("/tables", createTable)
router.get("/tables/:slug", getTableBySlug)
// to access it user need to login (authentication), then role of that user is admin(authorization)
router.get("/tables", verify, checkRole(["admin"]), getAllTable)
export default router 