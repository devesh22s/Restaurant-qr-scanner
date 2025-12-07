import express from 'express'
import  {createTable}  from '../controller/tableController.js';
const router = express.Router();

router.post("/tables", createTable)
export default router