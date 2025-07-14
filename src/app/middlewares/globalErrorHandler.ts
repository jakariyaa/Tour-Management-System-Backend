import { NextFunction, Request, Response } from "express";
import { constants } from "http2";

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = "Something went wrong.";

  res.status(statusCode).json({
    success: false,
    message: message,
    error: error,
  });

  next();
};
