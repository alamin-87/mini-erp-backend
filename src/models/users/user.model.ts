import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "../../types/userType";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.EMPLOYEE,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre("find", function () {
  this.where({ isDeleted: { $ne: true } });
});

userSchema.pre("findOne", function () {
  this.where({ isDeleted: { $ne: true } });
});

export const User = mongoose.model<IUser>("User", userSchema);
