import type { Request, Response } from "express";
import status from "http-status";

export const NotFound = (req: Request, res: Response) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "API Not Found",
    error: {
      path: req.originalUrl,
      method: req.method,
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
};
