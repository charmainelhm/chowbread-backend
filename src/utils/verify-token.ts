import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

interface customRequest extends Request {
  headers: {
    access_token?: string;
  };
  user?: any;
}

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? "";
export const verifyToken = (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string | null = (req.headers.access_token as string) || null;
  if (!token) return next(createError(404, "You are not authenticated!"));

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) return next(createError(403, "Access token is not valid"));
    req.user = user;
    next();
  });
  // check validity of access token
  // if access token not valid, check if theres a valid refresh token
  // generate new access token if refresh token is valid
  // validate information given in the access token
};
