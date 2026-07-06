import status from "http-status";
import bcrypt from "bcrypt";
import AppError from "../../ErrorHelper/AppError";
import { User } from "../users/user.model";
import { createToken } from "../../lib/jwtHelper";
import { envVars } from "../../config/env";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import { UserRole } from "../../types/userType";

const registerUser = async (payload: IRegisterUser) => {
  const { name, email, password } = payload;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(status.CONFLICT, "User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: UserRole.EMPLOYEE,
  });

  // Generate tokens
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    emailVerified: false,
  };

  const accessToken = createToken(
    jwtPayload,
    envVars.ACCESS_TOKEN_SECRET,
    envVars.ACCESS_TOKEN_EXPIRES_IN
  );

  const refreshToken = createToken(
    jwtPayload,
    envVars.REFRESH_TOKEN_SECRET,
    envVars.REFRESH_TOKEN_EXPIRES_IN
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  // Find user with password field included
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError(status.UNAUTHORIZED, "Invalid email or password");
  }

  if (user.isDeleted) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  // Compare password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(status.UNAUTHORIZED, "Invalid email or password");
  }

  // Generate tokens
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    emailVerified: true,
  };

  const accessToken = createToken(
    jwtPayload,
    envVars.ACCESS_TOKEN_SECRET,
    envVars.ACCESS_TOKEN_EXPIRES_IN
  );

  const refreshToken = createToken(
    jwtPayload,
    envVars.REFRESH_TOKEN_SECRET,
    envVars.REFRESH_TOKEN_EXPIRES_IN
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return user;
};

export const AuthService = {
  registerUser,
  loginUser,
  getMe,
};