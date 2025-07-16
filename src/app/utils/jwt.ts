import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export const generateToken = (payload: JwtPayload) => {
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions);

  return token;
};

export const verifyToken = (token: string) => {
  const verified = jwt.verify(token, env.JWT_SECRET);
  return verified;
};
