import status from "http-status";
import { Product } from "./product.model";
import AppError from "../../ErrorHelper/AppError";
import fs from "fs";
import { QueryBuilder } from "../../utils/QueryBuilder";
import type { IQueryParams } from "../../interfaces/query.interface";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../config/cloudinary.config";

interface IProductQuery extends IQueryParams {
  category?: string;
}

const createProduct = async (payload: any, file?: Express.Multer.File) => {
  if (!file) {
    throw new AppError(status.BAD_REQUEST, "Product image is required");
  }

  const uploadResult = await uploadFileToCloudinary(
    fs.readFileSync(file.path),
    file.originalname,
    file.mimetype
  );

  if (file.path) {
    fs.unlinkSync(file.path);
  }

  const productData = {
    ...payload,
    productImage: uploadResult.url,
    imagePublicId: uploadResult.public_id,
  };

  const product = await Product.create(productData);
  return product;
};

const getAllProducts = async (query: IProductQuery) => {
  const builder = new QueryBuilder(Product.find(), query, {
    searchableFields: ["productName", "sku", "category"],
    filterableFields: ["category", "stockQuantity", "purchasePrice", "sellingPrice"],
  });

  builder.search().filter();

  if (query.category) {
    builder.modelQuery = builder.modelQuery.find({ category: { $regex: query.category, $options: "i" } } as any);
  }

  builder.sort().paginate();

  return builder.execute();
};

const getProductById = async (id: string) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(status.NOT_FOUND, "Product not found");
  }

  return product;
};

const updateProduct = async (
  id: string,
  payload: any,
  file?: Express.Multer.File
) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(status.NOT_FOUND, "Product not found");
  }

  // If new image uploaded, replace the previous Cloudinary asset
  if (file) {
    if (product.imagePublicId) {
      await deleteFileFromCloudinary(product.imagePublicId);
    }

    const uploadResult = await uploadFileToCloudinary(
      fs.readFileSync(file.path),
      file.originalname,
      file.mimetype
    );

    if (file.path) {
      fs.unlinkSync(file.path);
    }

    payload.productImage = uploadResult.url;
    payload.imagePublicId = uploadResult.public_id;
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedProduct;
};

const deleteProduct = async (id: string) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(status.NOT_FOUND, "Product not found");
  }

  if (product.imagePublicId) {
    await deleteFileFromCloudinary(product.imagePublicId);
  }

  // Soft delete
  product.isDeleted = true;
  await product.save();

  return product;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
