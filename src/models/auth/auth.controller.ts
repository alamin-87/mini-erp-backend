import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import status from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getMe(req.user!.userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  getMe,
};