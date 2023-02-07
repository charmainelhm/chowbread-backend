import express from "express";
import verifyToken from "../utils/verify-token.js";
import {
  createExpense,
  getAllExpenses,
  getUserExpenses,
  updateUserExpense,
  deleteExpense,
} from "../controllers/expense-controller.js";
const router = express.Router();

//create new expense
router.post("/", verifyToken, createExpense);
//get all expenses
router.get("/all", verifyToken, getAllExpenses);
//get expenses by user id
router.get("/:userId", verifyToken, getUserExpenses);
//update expense by id
router.put("/:expenseId", verifyToken, updateUserExpense);
//delete expense by id
router.delete("/:expenseId", verifyToken, deleteExpense);

export default router;
