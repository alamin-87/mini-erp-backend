import { Router } from "express";
import { validateRequest } from "../../middlewares/ValidetRequest";
import { registerUserValidation, loginUserValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/checkAuth";

const router = Router();

router.post("/register", validateRequest(registerUserValidation), AuthController.registerUser);
router.post("/login", validateRequest(loginUserValidation), AuthController.loginUser);
router.get("/me", auth(), AuthController.getMe);

export const AuthRoute = router;