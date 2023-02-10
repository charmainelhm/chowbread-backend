import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
const prisma = new PrismaClient();

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const emailExist = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (emailExist) {
      return next(createError(409, "Email has been taken"));
    }

    const salt: string = bcrypt.genSaltSync(10);
    const hashedPassword: string = bcrypt.hashSync(req.body.password, salt);
    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
        session: {
          create: {
            isValid: false,
          },
        },
      },
    });

    res.status(200).json(user);
  } catch (err: any) {
    next(err);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.isAdmin) {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (err: any) {
      next(err);
    }
  } else {
    return next(
      createError(403, "You are not authorised to perform this operation!")
    );
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.isAdmin || req.user.id === req.params.id) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.params.id,
        },
      });

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  } else {
    return next(
      createError(403, "You are not authorised to perform this operation!")
    );
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

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.id === req.params.id) {
    try {
      const response = await prisma.user.delete({
        where: { id: req.params.id },
      });

      res.status(200).send(response);
    } catch (err) {
      console.log(err);
    }
  } else
    return next(
      createError(403, "You are not authorised to perform this operation!")
    );
};
