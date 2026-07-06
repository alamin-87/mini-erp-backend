import status from "http-status";
import mongoose from "mongoose";
import { Sale } from "./sale.model";
import { Product } from "../Product/product.model";
import AppError from "../../ErrorHelper/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import type { IQueryParams } from "../../interfaces/query.interface";

interface ISaleInput {
  items: Array<{
    product: string;
    quantity: number;
  }>;
}

const createSale = async (payload: ISaleInput, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const saleItems = [];
    let grandTotal = 0;

    for (const item of payload.items) {
      // Find the product
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new AppError(
          status.NOT_FOUND,
          `Product with ID ${item.product} not found`
        );
      }

      if (product.isDeleted) {
        throw new AppError(
          status.BAD_REQUEST,
          `Product "${product.productName}" is no longer available`
        );
      }

      // Check stock availability
      if (product.stockQuantity < item.quantity) {
        throw new AppError(
          status.BAD_REQUEST,
          `Insufficient stock for "${product.productName}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`
        );
      }

      // Calculate item total
      const totalPrice = product.sellingPrice * item.quantity;
      grandTotal += totalPrice;

      saleItems.push({
        product: product._id,
        productName: product.productName,
        quantity: item.quantity,
        unitPrice: product.sellingPrice,
        totalPrice,
      });

      // Reduce stock
      product.stockQuantity -= item.quantity;
      await product.save({ session });
    }

    // Create the sale
    const [sale] = await Sale.create(
      [
        {
          items: saleItems,
          grandTotal,
          soldBy: userId,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    // Populate the sale with product details
    const populatedSale = await Sale.findById(sale._id)
      .populate("items.product", "productName sku category")
      .populate("soldBy", "name email");

    return populatedSale;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllSales = async (query: IQueryParams) => {
  const baseQuery = Sale.find()
    .populate("items.product", "productName sku category")
    .populate("soldBy", "name email");

  const builder = new QueryBuilder(baseQuery, query, {
    searchableFields: ["grandTotal"],
    filterableFields: ["grandTotal"],
  });

  builder.search().filter().sort().paginate();

  return builder.execute();
};

const getSaleById = async (id: string) => {
  const sale = await Sale.findById(id)
    .populate("items.product", "productName sku category sellingPrice")
    .populate("soldBy", "name email");

  if (!sale) {
    throw new AppError(status.NOT_FOUND, "Sale not found");
  }

  return sale;
};

export const SaleService = {
  createSale,
  getAllSales,
  getSaleById,
};
