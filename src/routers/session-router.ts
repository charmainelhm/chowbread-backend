import express from "express";
import {
  createSession,
  getSession,
  invalidateSession,
} from "../controllers/session-controller.js";
const router = express.Router();

// create user session
router.post("/", createSession);
// get user session
router.get("/:userId", getSession);
// invalidate user session
router.patch("/:userId", invalidateSession);

export default router;
