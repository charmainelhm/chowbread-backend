import express from "express";
import { createUser } from "../controllers/user-controller.js";
const router = express.Router();

//create new user
router.post("/", createUser);
//get user by id
//get all users
//delete user by id

export default router;
