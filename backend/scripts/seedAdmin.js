import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env"), quiet: true });

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!process.env.DB_NAME || !email || !password) {
  console.error("DB_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  process.exit(1);
}

const { sequelize } = await import("../src/db/sequelize.js");
const { Admin } = await import("../src/db/models/index.js");

// Load-then-save so the model hook hashes the password.
const admin =
  (await Admin.scope("withPassword").findOne({
    where: { email: email.toLowerCase() },
  })) ?? Admin.build({ email, name: process.env.ADMIN_NAME || "Admin" });
admin.password = password;
await admin.save();

console.log(`Admin ready: ${admin.email}`);
await sequelize.close();
