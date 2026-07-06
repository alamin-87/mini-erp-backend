import { Router } from "express";
import { UserController } from "./user.controller";
import authMiddleWare from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/ValidetRequest";
import { updateUserSchema } from "./user.validation";
import { multerMemoryUpload } from "../../config/multer.config";

const router = Router();

router.get("/me", authMiddleWare(), UserController.getMe);
router.get("/:id", authMiddleWare(), UserController.getById);
router.patch(
  "/me",
  authMiddleWare(),
  multerMemoryUpload.fields([{ name: "profilePhoto", maxCount: 1 }]),
  validateRequest(updateUserSchema),
  UserController.updateUser
);
router.delete("/me", authMiddleWare(), UserController.deleteUser);

export const UserRoutes = router;
