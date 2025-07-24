export const handleJsonParseError = () => {
  return {
    statusCode: 400,
    message: "Syntax error: Invalid JSON format",
  };
};
