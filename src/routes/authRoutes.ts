import { Router } from "express";
import { register, login, logout, getCurrentUser } from "../controllers/authController";
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from "../middlewares/validators";
import { isAuthenticated } from "../middlewares/authMiddlewares";

const router = Router();

router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  register,
);

router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  login,
);

router.post("/logout", isAuthenticated, logout);

router.get("/me", isAuthenticated, getCurrentUser);

export default router;
