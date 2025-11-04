"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("./errorHandler");
exports.validateRegister = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/\d/)
        .withMessage("Password must contain at least one number"),
    (0, express_validator_1.body)("name")
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
];
exports.validateLogin = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        throw new errorHandler_1.AppError(errorMessages.join(", "), 400);
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
