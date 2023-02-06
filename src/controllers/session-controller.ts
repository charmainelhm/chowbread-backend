import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
const prisma = new PrismaClient();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? "";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET ?? "";

export const createSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user) return next(createError(404, "Invalid email address!"));
    const correctPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!correctPassword) {
      return next(createError(404, "Email and password do not match!"));
    }

    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = jwt.sign(userData, accessTokenSecret, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(userData, refreshTokenSecret, {
      expiresIn: "30d",
    });

    const session = await prisma.session.update({
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
