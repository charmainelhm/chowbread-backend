import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const salt: string = bcrypt.genSaltSync(10);
    const hashedPassword: string = bcrypt.hashSync(req.body.password, salt);
    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });

    res.status(200).json(user);
  } catch (err: any) {
    console.log(err);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err: any) {
    console.log(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
};

// export const updateUserById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user = await prisma.user.update({
//       where: { id: req.params.id},
//       data: {}
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const deleteUserById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const response = await prisma.user.delete({
//       where: { id: req.params.id },
//     });

//     res.status(200).send(response);
//   } catch (err) {
//     console.log(err);
//   }
// };
