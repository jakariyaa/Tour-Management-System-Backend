import bcrypt from "bcryptjs";
import { constants } from "http2";
import AppError from "../../errorHelpers/AppError";
import { generateToken } from "../../utils/jwt";
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

  const jwtPayload = {
    _id: user._id,
    email: user.email,
    name: user.name,
  };

  const token = generateToken(jwtPayload);

  return {
    name: user.name,
    token,
  };
};

export const AuthService = {
  credentialsLogin,
};
