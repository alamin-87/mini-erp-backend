import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { SaleService } from "./sale.service";
import status from "http-status";

const getIdFromRequest = (req: Request) => {
  return Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
};

const createSale = catchAsync(async (req: Request, res: Response) => {
  const result = await SaleService.createSale(req.body, req.user!.userId);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Sale created successfully",
    data: result,
  });
});

const getAllSales = catchAsync(async (req: Request, res: Response) => {
  const result = await SaleService.getAllSales(req.query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Sales fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSaleById = catchAsync(async (req: Request, res: Response) => {
  const result = await SaleService.getSaleById(getIdFromRequest(req));

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Sale fetched successfully",
    data: result,
  });
});

export const SaleController = {
  createSale,
  getAllSales,
  getSaleById,
};
