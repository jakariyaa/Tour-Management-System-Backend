import { Request, Response } from "express";
import { constants } from "http2";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);
  res.status(constants.HTTP_STATUS_CREATED).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  res.status(constants.HTTP_STATUS_OK).json({
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
};
