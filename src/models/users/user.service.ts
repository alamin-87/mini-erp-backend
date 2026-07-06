import status from "http-status";
import AppError from "../../ErrorHelper/AppError";
import { User } from "./user.model";

const updateUser = async (userId: string, payload: any, file?: Express.Multer.File) => {
  const user = await User.findById(userId);

  if (!user || user.isDeleted) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (file) {
    payload.profilePhoto = `/uploads/${file.originalname}`;
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

const getById = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user || user.isDeleted) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return user;
};

const deleteUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user || user.isDeleted) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  user.isDeleted = true;
  await user.save();

  return user;
};

export const UserService = {
  getById,
  updateUser,
  deleteUser,
};