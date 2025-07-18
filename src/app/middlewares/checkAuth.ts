import { NextFunction, Request, Response } from "express";
import { constants } from "http2";
import { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new AppError(
          constants.HTTP_STATUS_BAD_REQUEST,
          "No Token Recieved"
        );
      }

      const verifiedToken = verifyToken(
        token,
        env.JWT_ACCESS_SECRET
      ) as JwtPayload;
      const user = await User.findById(verifiedToken._id);

      if (!user) {
        throw new AppError(
          constants.HTTP_STATUS_UNAUTHORIZED,
          "User not found"
        );
      }

      if (!authRoles.includes(user?.role as string)) {
        throw new AppError(
          constants.HTTP_STATUS_FORBIDDEN,
          "You are not permitted to view this route!"
        );
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
