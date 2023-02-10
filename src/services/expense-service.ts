import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const querySingleExpense = async (expenseId: string) => {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    return expense;
  } catch (err: any) {
    throw new Error(err);
  }
};
