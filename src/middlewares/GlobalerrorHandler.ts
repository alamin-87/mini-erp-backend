import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import AppError from "../ErrorHelper/AppError";
import { handleZodError } from "../ErrorHelper/HandelZodError";
import { envVars } from "../config/env";
import type { TErrorSources } from "../interfaces/error.interface";
import mongoose from "mongoose";

export const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources[] = [
    { path: "", message: "Something went wrong!" },
  ];
  if (err instanceof ZodError) {
    const zodError = handleZodError(err);
    statusCode = zodError.statusCode || 400;
    message = zodError.message;
    errorSources = zodError.errorSources;
  }
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ path: "", message: err.message }];
  }
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation Error";
    errorSources = Object.values(err.errors).map((val) => ({
      path: val.path,
      message: val.message,
    }));
  }
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid ID";
    errorSources = [{ path: err.path, message: `Invalid value: ${err.value}` }];
  }

  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field: ${field}`;
    errorSources = [{ path: field || "", message }];
  }

  else if (err instanceof Error) {
    message = err.message;
    errorSources = [{ path: "", message: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: envVars.NODE_ENV === "development" ? err?.stack : undefined,
  });
};
