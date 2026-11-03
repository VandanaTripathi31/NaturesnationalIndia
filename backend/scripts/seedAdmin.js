import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Admin from "../src/models/Admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env"), quiet: true });

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!process.env.MONGO_URI || !email || !password) {
  console.error("MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);

// Load-then-save so the model's pre-save hook hashes the password.
const admin =
  (await Admin.findOne({ email: email.toLowerCase() })) ??
  new Admin({ email, name: process.env.ADMIN_NAME || "Admin" });
admin.password = password;
await admin.save();

console.log(`Admin ready: ${admin.email}`);
await mongoose.disconnect();
