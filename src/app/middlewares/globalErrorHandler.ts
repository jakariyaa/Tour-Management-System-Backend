import { NextFunction, Request, Response } from "express";
import { constants } from "http2";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";
import { env } from "../config/env";
import AppError from "../error/AppError";
import { handleJsonParseError } from "../error/handleJsonParseError";
import { handleJwtError } from "../error/handleJwtError";
import { handleMongooseError } from "../error/handleMongooseError";
import { handleZodError } from "../error/handleZodError";

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(`globalErrorHandler: ${error.name} \n`, error);
  }

  let statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  let message = "Something went wrong!";
  let errorSources: { path: string; message: string }[] | undefined = undefined;

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errors;
  } else if (
    error.name === "ValidationError" ||
    error.name === "CastError" ||
    ("code" in error && error.code === 11000)
  ) {
    const simplifiedError = handleMongooseError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errors;
  } else if (
    error instanceof JsonWebTokenError ||
    error instanceof TokenExpiredError
  ) {
    const simplifiedError = handleJwtError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errors;
  } else if (error.name === "SyntaxError" && error.message.includes("JSON")) {
    const simplifiedError = handleJsonParseError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorSources = undefined;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    error: env.NODE_ENV === "development" ? error : undefined,
    stack: env.NODE_ENV === "development" ? error.stack : undefined,
  });
};
