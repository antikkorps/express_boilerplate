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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.POSTGRES_DB || "mydb",
    dialect: "postgres",
    username: process.env.POSTGRES_USER || "myuser",
    password: process.env.POSTGRES_PASSWORD || "mypassword",
    host: process.env.POSTGRES_HOST || "my_postgres",
    port: parseInt(process.env.POSTGRES_PORT || "5433"),
    models: [path_1.default.join(__dirname, "../models")],
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log("Database connection established successfully.");
        // Sync models in development (create tables if they don't exist)
        if (process.env.NODE_ENV !== "production") {
            yield sequelize.sync({ alter: true });
            console.log("Database synchronized.");
        }
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
    }
});
exports.connectDatabase = connectDatabase;
exports.default = sequelize;
