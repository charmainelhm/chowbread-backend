import { Request, Response, NextFunction } from "express";
import { Expense, PrismaClient } from "@prisma/client";
import { createError } from "../utils/error.js";
import { querySingleExpense } from "../services/expense-service.js";
const prisma = new PrismaClient();

export const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const expense: Expense = await prisma.expense.create({
      data: {
        ...req.body,
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    res.status(200).json(expense);
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};

export const getAllExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.isAdmin) {
    try {
      const expenses: Expense[] = await prisma.expense.findMany();
      res.status(200).json(expenses);
    } catch (err: any) {
      console.log(err);
      next(err);
    }
  } else {
    return next(
      createError(403, "You are not authorised to perform this operation!")
    );
  }
};

export const getUserExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.id === req.params.userId) {
    try {
      const userExpenses: Expense[] = await prisma.expense.findMany({
        where: { userId: req.user.id },
      });

      res.status(200).json(userExpenses);
    } catch (err: any) {
      console.log(err);
      next(err);
    }
  } else {
    return next(
      createError(403, "You are not authorised to perform this operation!")
    );
  }
};

export const updateUserExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const expense: Expense | null = await querySingleExpense(
      req.params.expenseId
    );
    if (expense?.userId === req.user.id) {
      const updatedExpense: Expense = await prisma.expense.update({
        where: {
          id: req.params.expenseId,
        },
        data: {
          ...req.body,
        },
      });

      res.status(200).json(updatedExpense);
    } else
      return next(
        createError(403, "You are not authorised to perform this operation!")
      );
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const expense: Expense | null = await querySingleExpense(
      req.params.expenseId
    );
    if (expense?.userId === req.user.id) {
      const data = await prisma.expense.delete({
        where: {
          id: req.params.expenseId,
        },
      });

      res.status(200).json(data);
    } else {
      return next(
        createError(403, "You are not authorised to perform this operation!")
      );
    }
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};
