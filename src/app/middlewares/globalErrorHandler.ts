import { NextFunction, Request, Response } from "express";
import { constants } from "http2";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // eslint-disable-next-line no-console
  console.log(`An error occured: ${error.name} \n`, error);

  let statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  let message = `Something went wrong: ${error.name}`;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error: error,
  });

  next();
};
