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
exports.authenticateUser = exports.registerUser = void 0;
const user_1 = require("../models/user");
const bcrypt_1 = require("../utils/bcrypt");
const registerUser = (email, password, name) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield (0, bcrypt_1.hashPassword)(password);
    return yield (0, user_1.createUser)(email, hashedPassword, name);
});
exports.registerUser = registerUser;
const authenticateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_1.findUserByEmail)(email);
    if (user && (yield (0, bcrypt_1.comparePasswords)(password, user.password))) {
        return user;
    }
    return null;
});
exports.authenticateUser = authenticateUser;
