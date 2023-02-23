import express from "express";
import {
  createSession,
  getSession,
  invalidateSession,
} from "../controllers/session-controller.js";
import verifyToken from "../utils/verify-token.js";
const router = express.Router();

// create user session
router.post("/", createSession);
// get user session
router.get("/user", verifyToken, getSession);
// router.get("/:userId", verifyToken, getSession);
// invalidate user session
router.patch("/:userId", verifyToken, invalidateSession);

export default router;
