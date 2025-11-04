import { Request, Response, NextFunction } from "express";
import { registerUser, authenticateUser } from "../services/authService";
import { asyncHandler, AppError } from "../middlewares/errorHandler";

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body;

    try {
      const user = await registerUser(email, password, name);

      // Remove password from response
      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: { user: userResponse },
      });
    } catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new AppError("Email already exists", 409);
      }
      throw error;
    }
  },
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      // Remove password from response
      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: { user: userResponse },
      });
    });
  },
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        status: "success",
        message: "Logout successful",
      });
    });
  },
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Authentication is handled by isAuthenticated middleware
    const user = req.user as any;

    // Remove password from response
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    res.status(200).json({
      status: "success",
      data: { user: userResponse },
    });
  },
);
