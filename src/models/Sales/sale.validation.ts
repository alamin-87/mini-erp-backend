import { z } from "zod";

export const createSaleValidation = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          product: z.string().min(1, "Product ID is required"),
          quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
        })
      )
      .min(1, "At least one product is required"),
  }),
});
