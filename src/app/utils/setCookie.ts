import { Response } from "express";

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export function setAuthCookie(res: Response, authTokens: AuthTokens) {
  if (authTokens.accessToken) {
    res.cookie("accessToken", authTokens.accessToken, {
      httpOnly: true,
      secure: true,
    });
  }
  if (authTokens.refreshToken) {
    res.cookie("refreshToken", authTokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
  }
}