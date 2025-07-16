import bcrypt from "bcryptjs";
import { constants } from "http2";
import AppError from "../../errorHelpers/AppError";
import {
  createUserToken,
  generateNewAccessTokenWithRefreshToken,
} from "../../utils/userToken";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      constants.HTTP_STATUS_UNAUTHORIZED,
      "Email does not exist"
    );
  }
  const isPasswordMatched = await bcrypt.compare(
    password as string,
    user.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(constants.HTTP_STATUS_UNAUTHORIZED, "Invalid password");
  }

  const { accessToken, refreshToken } = createUserToken(user);
  return {
    name: user.name,
    accessToken,
    refreshToken,
  };
};

const generateNewAccessToken = async (refreshToken: string) => {
  const { jwtPayload, accessToken } =
    await generateNewAccessTokenWithRefreshToken(refreshToken);

  const user = await User.findOne({ email: jwtPayload.email });
  if (!user) {
    throw new AppError(
      constants.HTTP_STATUS_UNAUTHORIZED,
      "User email does not exist"
    );
  }
  return {
    accessToken,
  };
};

export const AuthService = {
  credentialsLogin,
  generateNewAccessToken,
};
