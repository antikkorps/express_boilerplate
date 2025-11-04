import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

/**
 * Middleware to check if user is authenticated
 * Throws 401 error if user is not authenticated
 *
 * @example
 * router.get("/protected", isAuthenticated, controller);
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.isAuthenticated()) {
    throw new AppError("Not authenticated", 401);
  }
  next();
};

/**
 * Middleware to check if user is NOT authenticated
 * Throws 400 error if user is already authenticated
 * Useful for login/register routes
 *
 * @example
 * router.post("/login", isNotAuthenticated, controller);
 */
export const isNotAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.isAuthenticated()) {
    throw new AppError("Already authenticated", 400);
  }
  next();
};

/**
 * Middleware to check if user has a specific role
 * Throws 403 error if user doesn't have required role
 *
 * @param roles - Array of allowed roles
 * @example
 * router.delete("/users/:id", isAuthenticated, hasRole(["admin"]), controller);
 */
export const hasRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.isAuthenticated()) {
      throw new AppError("Not authenticated", 401);
    }

    const user = req.user as any;
    if (!user.role || !roles.includes(user.role)) {
      throw new AppError("Insufficient permissions", 403);
    }

    next();
  };
};

/**
 * Middleware to attach user info to request
 * Does not throw error if user is not authenticated
 * Useful for optional authentication
 *
 * @example
 * router.get("/public", optionalAuth, controller);
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // User will be attached to req.user if authenticated
  // Otherwise, req.user will be undefined
  next();
};
