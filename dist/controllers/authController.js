"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logout = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const errorHandler_1 = require("../middlewares/errorHandler");
exports.register = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    try {
        const user = yield (0, authService_1.registerUser)(email, password, name);
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
    }
    catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            throw new errorHandler_1.AppError("Email already exists", 409);
        }
        throw error;
    }
}));
exports.login = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield (0, authService_1.authenticateUser)(email, password);
    if (!user) {
        throw new errorHandler_1.AppError("Invalid email or password", 401);
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
}));
exports.logout = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            status: "success",
            message: "Logout successful",
        });
    });
}));
exports.getCurrentUser = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        throw new errorHandler_1.AppError("Not authenticated", 401);
    }
    const user = req.user;
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
}));
