import { Request, Response } from "express";
import { constants } from "http2";
import AppError from "../../error/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IUser } from "./user.interface";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);
  sendResponse(res, {
    statusCode: constants.HTTP_STATUS_CREATED,
    success: true,
    message: "User created successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  sendResponse(res, {
    statusCode: constants.HTTP_STATUS_OK,
    success: true,
    message: "Users retrieved successfully",
    data: users,
    meta: { total: users.length },
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { params, body, user: tokenUser } = req;
  if (!tokenUser) {
    throw new AppError(constants.HTTP_STATUS_UNAUTHORIZED, "User not found");
  }
  const user = await UserService.updateUser(
    params.id,
    body,
    tokenUser as IUser
  );
  sendResponse(res, {
    statusCode: constants.HTTP_STATUS_OK,
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
};
