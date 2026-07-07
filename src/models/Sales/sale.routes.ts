import { Router } from "express";
import { SaleController } from "./sale.controller";
import auth from "../../middlewares/checkAuth";
import authorize from "../../middlewares/authorize";
import { UserRole } from "../../types/userType";
import { Permission } from "../../types/permissions";
import { validateRequest } from "../../middlewares/ValidetRequest";
import { createSaleValidation } from "./sale.validation";

const router = Router();
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  authorize(Permission.CREATE_SALES),
  validateRequest(createSaleValidation),
  SaleController.createSale
);

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  authorize(Permission.VIEW_SALES),
  SaleController.getAllSales
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  authorize(Permission.VIEW_SALES),
  SaleController.getSaleById
);

export const SaleRoute = router;
