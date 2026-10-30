import "./env.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize } from "../../src/db/sequelize.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(
  path.join(here, "..", "..", "src", "db", "schema.sql"),
  "utf8",
);

const TABLES = [
  "blog_blog_categories",
  "blogs",
  "blog_categories",
  "products",
  "categories",
  "enquiries",
  "admins",
];

// Drops and recreates every table in the TEST database from schema.sql.
export async function resetDb() {
  if (sequelize.config.database !== process.env.TEST_DB_NAME) {
    throw new Error("resetDb refused: not connected to the test database");
  }
  await sequelize.query("SET FOREIGN_KEY_CHECKS=0");
  for (const table of TABLES) {
    await sequelize.query(`DROP TABLE IF EXISTS \`${table}\``);
  }
  await sequelize.query("SET FOREIGN_KEY_CHECKS=1");

  const statements = schema
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await sequelize.query(statement);
  }
}

export async function closeDb() {
  await sequelize.close();
}
