import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import { User, Session } from "../models/index.js";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? "";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET ?? "";

export const createUserSession = async (user: User) => {
  try {
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

    return { access_token: accessToken, refresh_token: refreshToken };
  } catch (err: any) {
    throw new Error(err);
  }
};
