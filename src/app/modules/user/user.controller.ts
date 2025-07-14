import { NextFunction, Request, Response } from "express";
import { constants } from "http2";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
};
