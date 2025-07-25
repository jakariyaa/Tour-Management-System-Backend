import { constants } from "http2";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const handleJwtError = (err: JsonWebTokenError | TokenExpiredError) => {
  if (err instanceof TokenExpiredError) {
    return {
      statusCode: constants.HTTP_STATUS_UNAUTHORIZED,
      message: "JWT Token expired",
      errors: undefined,
    };
  }

  return {
    statusCode: constants.HTTP_STATUS_UNAUTHORIZED,
    message: "Invalid JWT token",
    errors: undefined,
  };
};
