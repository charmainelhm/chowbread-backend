import { PrismaClient, Expense } from "@prisma/client";
const prisma = new PrismaClient();

export const querySingleExpense = async (
  expenseId: string
): Promise<Expense | null> => {
  try {
    const expense: Expense | null = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    return expense;
  } catch (err: any) {
    throw new Error(err);
  }
};
