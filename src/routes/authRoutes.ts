import { Router } from "express";
import { register, login, logout, getCurrentUser } from "../controllers/authController";
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from "../middlewares/validators";

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

router.post("/logout", logout);

router.get("/me", getCurrentUser);

export default router;
