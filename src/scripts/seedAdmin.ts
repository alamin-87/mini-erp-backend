import bcrypt from "bcrypt";
import { envVars } from "../config/env";
import { User } from "../models/users/user.model";
import { UserRole } from "../types/userType";

export const seedSuperAdmin = async () => {
  try {
    const existingUser = await User.findOne({ email: envVars.ADMIN_EMAIL });

    if (existingUser) {
      return;
    }

    const hashedPassword = await bcrypt.hash(envVars.ADMIN_PASSWORD, 12);

    await User.create({
      name: "Super Admin",
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
  } catch (error) {
    console.error("Failed to seed admin user", error);
  }
};