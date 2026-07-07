import { Router } from "express";
import { ProductController } from "./product.controller";
import auth from "../../middlewares/checkAuth";
import authorize from "../../middlewares/authorize";
import { UserRole } from "../../types/userType";
import { Permission } from "../../types/permissions";
import { uploadProductImage } from "../../utils/multerUpload";
import { validateRequest } from "../../middlewares/ValidetRequest";
import {
  createProductValidation,
  updateProductValidation,
} from "./product.validation";

const router = Router();
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  authorize(Permission.VIEW_PRODUCTS),
  ProductController.getAllProducts
);

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  authorize(Permission.VIEW_PRODUCTS),
  ProductController.getProductById
);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  authorize(Permission.MANAGE_PRODUCTS),
  uploadProductImage.single("productImage"),
  validateRequest(createProductValidation),
  ProductController.createProduct
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  authorize(Permission.MANAGE_PRODUCTS),
  uploadProductImage.single("productImage"),
  validateRequest(updateProductValidation),
  ProductController.updateProduct
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  authorize(Permission.MANAGE_PRODUCTS),
  ProductController.deleteProduct
);

export const ProductRoute = router;
