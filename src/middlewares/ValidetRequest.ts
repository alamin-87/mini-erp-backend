import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";
import catchAsync from "../shared/catchAsync";
import AppError from "../ErrorHelper/AppError";
import status from "http-status";

export const validateRequest = (schema: ZodTypeAny) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstIssue = error.issues[0];
        next(new AppError(status.BAD_REQUEST, firstIssue?.message || "Validation error"));
        return;
      }
      next(error);
    }
  });
};
