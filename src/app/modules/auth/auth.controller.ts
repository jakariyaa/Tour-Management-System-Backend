import { Request, Response } from "express";
import { constants } from "http2";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { AuthService } from "./auth.service";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const data = await AuthService.credentialsLogin(req.body);
  setAuthCookie(res, data);
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
    setAuthCookie(res, data);
    sendResponse(res, {
      statusCode: constants.HTTP_STATUS_OK,
      success: true,
      message: "Access token generated successfully",
      data: data,
    });
  }
);

const credentialsLogout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  sendResponse(res, {
    statusCode: constants.HTTP_STATUS_OK,
    success: true,
    message: "User logged out successfully",
    data: null,
  });
});

export const AuthController = {
  credentialsLogin,
  generateNewAccessToken,
  credentialsLogout,
};
