import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
} from "../controllers/user-controller.js";
import verifyToken from "../utils/verify-token.js";
const router = express.Router();

//create new user
router.post("/", createUser);
//get all users
router.get("/all", verifyToken, getAllUsers);
//get user by id
router.get("/:id", verifyToken, getUserById);
// //delete user by id
router.delete("/:id", verifyToken, deleteUserById);

export default router;
