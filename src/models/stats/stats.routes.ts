import { Router } from "express";
import auth from "../../middlewares/checkAuth";
import { UserRole } from "../../types/userType";
import { StatsController } from "./stats.controller";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE),
  StatsController.getDashboardStats
);

export const StatsRoute = router;
