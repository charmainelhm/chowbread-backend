import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/user-controller.js";
const router = express.Router();

//create new user
router.post("/", createUser);
//get all users
router.get("/all", getAllUsers);
//get user by id
router.get("/:id", getUserById);
// //delete user by id
// router.delete("/:id", deleteUserById);

export default router;
