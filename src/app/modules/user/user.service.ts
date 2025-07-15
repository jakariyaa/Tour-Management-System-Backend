import bcrypt from "bcryptjs";
import { constants } from "http2";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError(constants.HTTP_STATUS_CONFLICT, "User already exists");
  }
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };
  const hashedPassword = await bcrypt.hash(password as string, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

export const UserService = {
  createUser,
  getAllUsers,
};
