import dotenv from "dotenv";
import status from "http-status";
import AppError from "../ErrorHelper/AppError";

dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  MONGO_URI: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  CLIENT_URL: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

const envConfig = (): EnvConfig => {
  const requiredVars = [
    "PORT",
    "NODE_ENV",
    "MONGO_URI",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "CLIENT_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${varName} is required but not set.`
      );
    }
  });

  return {
    PORT: process.env.PORT!,
    NODE_ENV: process.env.NODE_ENV!,
    MONGO_URI: process.env.MONGO_URI!,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN!,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN!,
    CLIENT_URL: process.env.CLIENT_URL!,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
  };
};

export const envVars = envConfig();