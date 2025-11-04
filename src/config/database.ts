import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.POSTGRES_DB || "mydb",
  dialect: "postgres",
  username: process.env.POSTGRES_USER || "myuser",
  password: process.env.POSTGRES_PASSWORD || "mypassword",
  host: process.env.POSTGRES_HOST || "my_postgres",
  port: parseInt(process.env.POSTGRES_PORT || "5433"),
  models: [path.join(__dirname, "../models")],
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Sync models in development (create tables if they don't exist)
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
      console.log("Database synchronized.");
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

export default sequelize;
