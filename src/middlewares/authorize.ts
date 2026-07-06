import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import AppError from "../ErrorHelper/AppError";
import { Permission, DEFAULT_ROLE_PERMISSIONS } from "../types/permissions";
import { UserRole } from "../types/userType";

const authorize = (...requiredPermissions: Permission[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const role = req.user?.role as UserRole | undefined;

      if (!role) {
        throw new AppError(status.UNAUTHORIZED, "You are not authorized");
      }

      const permissions = DEFAULT_ROLE_PERMISSIONS[role] || [];
      const hasAccess = requiredPermissions.every((permission) => permissions.includes(permission));

      if (!hasAccess) {
        throw new AppError(status.FORBIDDEN, "You do not have permission to perform this action");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorize;
