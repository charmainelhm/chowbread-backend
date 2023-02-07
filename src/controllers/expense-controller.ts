import { Request, Response, NextFunction } from "express";
import { Expense, PrismaClient } from "@prisma/client";
import { createError } from "../utils/error.js";
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
  try {
    const userExpenses: Expense[] = await prisma.expense.findMany({
      where: { userId: req.user.id },
    });

    res.status(200).json(userExpenses);
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};
