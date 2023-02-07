import express from "express";
import verifyToken from "../utils/verify-token.js";
import {
  createExpense,
  getAllExpenses,
  getUserExpenses,
} from "../controllers/expense-controller.js";
const router = express.Router();

//create new expense
router.post("/", verifyToken, createExpense);
//get all expenses
router.get("/all", verifyToken, getAllExpenses);
//get expenses by user id
router.get("/user", verifyToken, getUserExpenses);
//update expense by id
//delete expense by id

export default router;
