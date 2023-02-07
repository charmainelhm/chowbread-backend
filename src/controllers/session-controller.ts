import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
const prisma = new PrismaClient();
import { User, Session } from "../models/index.js";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? "";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET ?? "";

export const createSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User | null = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user) return next(createError(404, "Invalid email address!"));
    const correctPassword: boolean = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!correctPassword) {
      return next(createError(404, "Email and password do not match!"));
    }

    const userData: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isAdmin: boolean;
    } = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    };

    const accessToken: string = jwt.sign(userData, accessTokenSecret, {
      expiresIn: "30d",
    });

    const refreshToken: string = jwt.sign(userData, refreshTokenSecret, {
      expiresIn: "30d",
    });

    const session: Session = await prisma.session.update({
      where: {
        userId: userData.id,
      },
      data: {
        isValid: true,
      },
    });
    res
      .status(200)
      .json({ access_token: accessToken, refresh_token: refreshToken });
  } catch (err) {
    next(err);
  }
};

export const getSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session: Session | null = await prisma.session.findUnique({
      where: {
        userId: req.params.userId,
      },
    });

    if (!session) return next(createError(404, "User not found!"));
    res.status(200).json(session);
  } catch (err) {
    next(err);
  }
};

export const invalidateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session: Session = await prisma.session.update({
      where: {
        userId: req.params.userId,
      },
      data: {
        isValid: false,
      },
    });

    res.status(200).json({ access_token: null, refresh_token: null });
  } catch (err) {
    next(err);
  }
};
