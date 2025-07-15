import { NextFunction, Request, Response } from "express";
import { constants } from "http2";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = `Something went wrong ${error.message}`;

  if (error instanceof AppError) {
    statusCode = constants.HTTP_STATUS_BAD_REQUEST;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error: error,
  });

  next();
};
