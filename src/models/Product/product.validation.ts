import { z } from "zod";

export const createProductValidation = z.object({
  body: z.object({
    productName: z.string().min(1, "Product name is required"),
    sku: z.string().min(1, "SKU is required"),
    category: z.string().min(1, "Category is required"),
    purchasePrice: z.coerce.number().min(0, "Purchase price cannot be negative"),
    sellingPrice: z.coerce.number().min(0, "Selling price cannot be negative"),
    stockQuantity: z.coerce.number().int().min(0, "Stock quantity cannot be negative"),
  }),
});

export const updateProductValidation = z.object({
  body: z.object({
    productName: z.string().min(1).optional(),
    sku: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    purchasePrice: z.coerce.number().min(0).optional(),
    sellingPrice: z.coerce.number().min(0).optional(),
    stockQuantity: z.coerce.number().int().min(0).optional(),
  }),
});
