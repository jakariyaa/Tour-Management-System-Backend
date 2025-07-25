import bcrypt from "bcryptjs";
import { constants } from "http2";
import AppError from "../../error/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
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

const updateUser = async (
  id: string,
  payload: Partial<IUser>,
  tokenUser: IUser
) => {
  const isAdmin = tokenUser.role === Role.ADMIN;
  const isSuperAdmin = tokenUser.role === Role.SUPER_ADMIN;
  const isSelf = tokenUser._id?.toString() === id;

  if (!isAdmin && !isSuperAdmin && !isSelf) {
    throw new AppError(
      constants.HTTP_STATUS_FORBIDDEN,
      "You are not permitted to update this user!"
    );
  }

  if (
    (payload.isActive ||
      payload.role ||
      payload.isVerified ||
      payload.isDeleted) &&
    !isSuperAdmin
  ) {
    throw new AppError(
      constants.HTTP_STATUS_FORBIDDEN,
      "You are not permitted to change this information!"
    );
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError(constants.HTTP_STATUS_NOT_FOUND, "User not found");
  }

  if (payload.password) {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    payload.password = hashedPassword;
  }

  user.set(payload);
  await user.save();

  return user;
};

export const UserService = {
  createUser,
  getAllUsers,
  updateUser,
};
