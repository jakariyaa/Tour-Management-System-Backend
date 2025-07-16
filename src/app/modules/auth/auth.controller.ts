import { Request, Response } from "express";
import { constants } from "http2";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const data = await AuthService.credentialsLogin(req.body);
  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: true,
  });
  sendResponse(res, {
    statusCode: constants.HTTP_STATUS_OK,
    success: true,
    message: "User logged in successfully",
    data: data,
  });
});

const generateNewAccessToken = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        constants.HTTP_STATUS_UNAUTHORIZED,
        "Refresh token not found"
      );
    }
    const data = await AuthService.generateNewAccessToken(refreshToken);
    sendResponse(res, {
      statusCode: constants.HTTP_STATUS_OK,
      success: true,
      message: "Access token generated successfully",
      data: data,
    });
  }
);

export const AuthController = {
  credentialsLogin,
  generateNewAccessToken,
};
