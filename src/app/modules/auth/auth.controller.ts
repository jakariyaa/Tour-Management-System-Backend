import { Request, Response } from "express";
import { constants } from "http2";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const data = await AuthService.credentialsLogin(req.body);
  sendResponse(res, {
    statusCode: constants.HTTP_STATUS_OK,
    success: true,
    message: "User logged in successfully",
    data: data,
  });
});

export const AuthController = {
  credentialsLogin,
};
