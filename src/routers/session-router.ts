import express from "express";
import { createSession } from "../controllers/session-controller.js";
const router = express.Router();

// create user session
router.post("/", createSession);
// get user session
// invalidate user session

export default router;
