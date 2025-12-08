import express from 'express'
import { sessonController } from '../controller/sessionController.js';

const router = express.Router();

router.post("/session", sessonController)

export default router 