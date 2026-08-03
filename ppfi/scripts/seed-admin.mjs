/**
 * Seed the initial ADMIN account.
 *
 * Usage (Node 20+ loads the env file for us):
 *   node --env-file=.env.local scripts/seed-admin.mjs
 *
 * Requires MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in the environment.
 * Idempotent: updates the password/role if the admin already exists.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Missing MONGODB_URI, ADMIN_EMAIL or ADMIN_PASSWORD.");
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    passwordHash: String,
    role: String,
  },
  { timestamps: true },
);

const User = mongoose.models.User ?? mongoose.model("User", userSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  const email = ADMIN_EMAIL.toLowerCase();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const result = await User.findOneAndUpdate(
    { email },
    { $set: { name: "PPFI Admin", email, passwordHash, role: "admin" } },
    { upsert: true, new: true },
  );

  console.log(`✓ Admin ready: ${result.email}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
