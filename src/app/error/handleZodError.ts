import { ZodError } from "zod";
import { constants } from "http2";

export const handleZodError = (err: ZodError) => {
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
