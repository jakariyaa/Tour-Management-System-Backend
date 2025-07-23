import { NextFunction, Request, Response } from "express";
import { constants } from "http2";
import { ZodError } from "zod";
import { env } from "../config/env";
import AppError from "../errorHelpers/AppError";

const handleZodError = (err: ZodError) => {
  const errors = err.issues.map((issue) => {
    return {
      path: String(issue.path),
      message: issue.message,
    };
  });

  return {
    statusCode: constants.HTTP_STATUS_BAD_REQUEST,
    message: "Validation Error",
    errors,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleMongooseValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((el) => {
    const errorObj = el as { path: string; message: string };
    return {
      path: errorObj.path,
      message: errorObj.message,
    };
  });

  return {
    statusCode: constants.HTTP_STATUS_BAD_REQUEST,
    message: "Validation Error",
    errors,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleMongooseCastError = (err: any) => {
  return {
    statusCode: constants.HTTP_STATUS_BAD_REQUEST,
    message: "Invalid ID",
    errors: [
      {
        path: err.path,
        message: err.message,
      },
    ],
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleMongooseDuplicateError = (err: any) => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  return {
    statusCode: constants.HTTP_STATUS_CONFLICT,
    message: "Duplicate Entry",
    errors: [
      {
        path: Object.keys(err.keyValue)[0],
        message: `${extractedMessage} already exists`,
      },
    ],
  };
};

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
  let errors = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errors;
  } else if (error.name === "ValidationError") {
    const simplifiedError = handleMongooseValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errors;
  } else if (error.name === "CastError") {
    const simplifiedError = handleMongooseCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errors;
  } else if ("code" in error && error.code === 11000) {
    const simplifiedError = handleMongooseDuplicateError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errors;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = [
      {
        path: "",
        message: error.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error_sources: errors,
    error: env.NODE_ENV === "development" ? error : undefined,
    stack: env.NODE_ENV === "development" ? error.stack : undefined,
  });
};
