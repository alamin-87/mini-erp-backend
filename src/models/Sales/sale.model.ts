import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISaleItem {
  product: Types.ObjectId;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ISale extends Document {
  items: ISaleItem[];
  grandTotal: number;
  soldBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const saleItemSchema = new Schema<ISaleItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const saleSchema = new Schema<ISale>(
  {
    items: {
      type: [saleItemSchema],
      required: true,
      validate: {
        validator: (items: ISaleItem[]) => items.length > 0,
        message: "At least one product is required in a sale",
      },
    },
    grandTotal: {
      type: Number,
      required: true,
      min: [0, "Grand total cannot be negative"],
    },
    soldBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Sale = mongoose.model<ISale>("Sale", saleSchema);
