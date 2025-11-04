import "reflect-metadata";
import app from "./app";
import sequelize from "./config/database";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Sync models with database (use { force: true } to drop and recreate tables)
    await sequelize.sync();
    console.log("Database models synchronized.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
