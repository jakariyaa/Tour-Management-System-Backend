import { Request, Response } from "express";
import { constants } from "http2";
import { User } from "./user.model";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: error,
      data: null,
    });
  }
};

export const UserController = {
  createUser,
};
