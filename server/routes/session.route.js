import express from 'express';
import { createSession } from '../controller/sessionController.js'; // Controller ka naam sahi kiya

const router = express.Router();

// Base URL from index.js: /api/v1/session

// Final URL matches frontend: /api/v1/session/create
router.post("/create", createSession);

export default router;