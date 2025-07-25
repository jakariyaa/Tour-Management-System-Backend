import { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";

export const createUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  const accessToken = generateToken(
    jwtPayload,
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const generateNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const { _id, name, email } = verifyToken(
    refreshToken,
    env.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const jwtPayload = {
    _id,
    name,
    email,
  };

  const accessToken = generateToken(
    jwtPayload,
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES
  );

  return {
    jwtPayload,
    accessToken,
  };
};
