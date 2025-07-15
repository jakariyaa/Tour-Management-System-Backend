import { Request, Response } from "express";
import { constants } from "http2";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
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

export const UserController = {
  createUser,
  getAllUsers,
};
