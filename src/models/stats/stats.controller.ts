import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { StatsService } from "./stats.service";
import status from "http-status";

const getDashboardStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await StatsService.getDashboardStats();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Dashboard stats fetched successfully",
    data: result,
  });
});

export const StatsController = {
  getDashboardStats,
};
