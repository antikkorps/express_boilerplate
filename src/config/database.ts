import { Sequelize } from "sequelize-typescript";
import path from "path";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  models: [path.join(__dirname, "../models")],
  logging: false,
});

export default sequelize;
