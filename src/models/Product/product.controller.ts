import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ProductService } from "./product.service";
import status from "http-status";

const getIdFromRequest = (req: Request) => {
  return Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
};

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(req.body, req.file);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getAllProducts(req.query as any);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Products fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getProductById(getIdFromRequest(req));

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Product fetched successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.updateProduct(
    getIdFromRequest(req),
    req.body,
    req.file
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.deleteProduct(getIdFromRequest(req));

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
