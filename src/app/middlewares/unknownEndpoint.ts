import { Request, Response } from "express";

export const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Reached unknown endpoint",
    path: req.originalUrl,
  });
};
