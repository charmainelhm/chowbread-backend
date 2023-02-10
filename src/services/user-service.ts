import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const findUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    return user;
  } catch (err: any) {
    throw new Error(err);
  }
};
