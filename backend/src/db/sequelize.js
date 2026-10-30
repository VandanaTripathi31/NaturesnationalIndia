import { Sequelize } from "sequelize";

const database =
  process.env.NODE_ENV === "test" && process.env.TEST_DB_NAME
    ? process.env.TEST_DB_NAME
    : process.env.DB_NAME;

export const sequelize = new Sequelize(
  database,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    timezone: "+00:00",
    logging: false,
  },
);

export async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database!");
  } catch (err) {
    console.log("Database connection error:", err.message);
  }
}
