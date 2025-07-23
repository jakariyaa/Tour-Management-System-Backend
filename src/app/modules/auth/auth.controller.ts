import { NextFunction, Request, Response } from "express";
import { constants } from "http2";
import passport from "passport";
import { env } from "../../config/env";
import AppError from "../../error/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserToken } from "../../utils/userToken";
import { AuthService } from "./auth.service";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const data = await AuthService.credentialsLogin(req.body);
    await passport.authenticate(
      "local",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(
            new AppError(constants.HTTP_STATUS_UNAUTHORIZED, info.message)
          );
        }
        const userTokens = await createUserToken(user);
        setAuthCookie(res, userTokens);
        sendResponse(res, {
          statusCode: constants.HTTP_STATUS_OK,
          success: true,
          message: "User logged in successfully",
          data: {
            user,
            ...userTokens,
          },
        });
      }
    )(req, res, next);
  }
);

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

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(constants.HTTP_STATUS_UNAUTHORIZED, "User not found");
  }
  await AuthService.resetPassword(req.user, req.body);
  sendResponse(res, {
    statusCode: constants.HTTP_STATUS_OK,
    success: true,
    message: "Password reset successfully",
    data: null,
  });
});

const googleController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const redirectUrl = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["email", "profile"],
      state: redirectUrl as string,
    })(req, res, next);
  }
);

const googleCallbackController = catchAsync(
  async (req: Request, res: Response) => {
    let redirectUrl = req.query.state as string;
    if (redirectUrl.startsWith("/")) {
      redirectUrl = redirectUrl.slice(1);
    }
    if (!req.user) {
      throw new AppError(constants.HTTP_STATUS_UNAUTHORIZED, "User not found");
    }
    const authTokens = await AuthService.googleCallback(req.user);
    setAuthCookie(res, authTokens);
    res.redirect(`${env.FRONTEND_URL}/${redirectUrl}`);
  }
);

export const AuthController = {
  credentialsLogin,
  generateNewAccessToken,
  credentialsLogout,
  resetPassword,
  googleController,
  googleCallbackController,
};
