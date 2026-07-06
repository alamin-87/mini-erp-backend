import { Router } from "express";
import { AuthRoute } from "../models/auth/auth.routes";
import { ProductRoute } from "../models/Product/product.routes";
import { SaleRoute } from "../models/Sales/sale.routes";
import { UserRoutes } from "../models/users/user.routes";
import { StatsRoute } from "../models/stats/stats.routes";

const router = Router();

router.use("/auth", AuthRoute);
router.use("/products", ProductRoute);
router.use("/sales", SaleRoute);
router.use("/dashboard", StatsRoute);
router.use("/user", UserRoutes);
router.use("/users", UserRoutes);

export const IndexRoute = router;