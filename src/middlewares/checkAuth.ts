import type { Request, Response, NextFunction } from "express";
import status from "http-status";
import { verifyToken } from "../lib/jwtHelper";
import { envVars } from "../config/env";
import AppError from "../ErrorHelper/AppError";
import { UserRole } from "../types/userType";

/**
 * Auth middleware - verifies JWT and optionally checks roles
 * Usage:
 *   auth()                        → just verify token
 *   auth(UserRole.ADMIN)          → verify + must be ADMIN
 *   auth(UserRole.ADMIN, UserRole.MANAGER) → verify + must be ADMIN or MANAGER
 */
const auth = (...requiredRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(status.UNAUTHORIZED, "Authentication token is required");
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token, envVars.ACCESS_TOKEN_SECRET);

      // Attach user to request
      req.user = {
        userId: decoded.userId as string,
        role: decoded.role as UserRole,
        email: decoded.email as string,
        emailVerified: decoded.emailVerified as boolean,
      };

      // Check role-based access
      if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
        throw new AppError(
          status.FORBIDDEN,
          "You do not have permission to perform this action"
        );
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError(status.UNAUTHORIZED, "Invalid or expired token"));
      }
    }
  };
};

export default auth;
