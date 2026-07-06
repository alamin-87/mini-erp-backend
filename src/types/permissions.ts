import { UserRole } from "./userType";

export enum Permission {
  VIEW_PRODUCTS = "view_products",
  MANAGE_PRODUCTS = "manage_products",
  CREATE_SALES = "create_sales",
  VIEW_SALES = "view_sales",
  VIEW_DASHBOARD = "view_dashboard",
  MANAGE_USERS = "manage_users",
}

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_PRODUCTS,
    Permission.CREATE_SALES,
    Permission.VIEW_SALES,
    Permission.VIEW_DASHBOARD,
    Permission.MANAGE_USERS,
  ],
  [UserRole.MANAGER]: [
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_PRODUCTS,
    Permission.CREATE_SALES,
    Permission.VIEW_SALES,
    Permission.VIEW_DASHBOARD,
  ],
  [UserRole.EMPLOYEE]: [Permission.VIEW_PRODUCTS, Permission.CREATE_SALES, Permission.VIEW_DASHBOARD],
};
