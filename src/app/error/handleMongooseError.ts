/* eslint-disable @typescript-eslint/no-explicit-any */
import { constants } from "http2";

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

export const handleMongooseError = (error: any) => {
  if (error.name === "ValidationError") {
    return handleMongooseValidationError(error);
  } else if (error.name === "CastError") {
    return handleMongooseCastError(error);
  } else if (error.code === 11000) {
    return handleMongooseDuplicateError(error);
  }

  return {
    statusCode: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    message: "Something went wrong!",
    errors: [
      {
        path: "",
        message: "Something went wrong",
      },
    ],
  };
};
