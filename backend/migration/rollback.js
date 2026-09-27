import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const { connectMongo, disconnectMongo } = await import("./db/mongo.js");
const { default: Category } = await import("../src/models/Category.js");
const { default: Product } = await import("../src/models/Product.js");
const { logger } = await import("./lib/logger.js");

// Rollback = remove ONLY the documents this migration created. Because every
// imported record carries a `legacyId`, we can delete exactly those and leave
// any hand-created content untouched. Requires --confirm to actually delete.
const confirm = process.argv.includes("--confirm");

await connectMongo();

const catFilter = { legacyId: { $ne: null } };
const prodFilter = { legacyId: { $ne: null } };

const cats = await Category.countDocuments(catFilter);
const prods = await Product.countDocuments(prodFilter);

logger.info(`Rollback target → categories: ${cats}, products: ${prods}`);

if (!confirm) {
  logger.warn("Dry run. Re-run with --confirm to delete these records.");
} else {
  const p = await Product.deleteMany(prodFilter);
  const c = await Category.deleteMany(catFilter);
  logger.ok(`Deleted products: ${p.deletedCount}, categories: ${c.deletedCount}`);
}

await disconnectMongo();
