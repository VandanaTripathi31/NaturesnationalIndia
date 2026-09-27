import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const { createMysqlPool } = await import("./db/mysql.js");
const { connectMongo, disconnectMongo } = await import("./db/mongo.js");
const { default: Category } = await import("../src/models/Category.js");
const { default: Product } = await import("../src/models/Product.js");

// Post-migration validation: compares source vs destination counts and spot
// checks integrity (unique slugs, every product has a category, no orphans).
const pool = await createMysqlPool();
await connectMongo();

const [[{ srcCats }]] = [
  await pool.query(
    "SELECT COUNT(*) srcCats FROM catalog_category_entity WHERE entity_id > 2",
  ),
];
const [[{ srcProds }]] = [
  await pool.query("SELECT COUNT(*) srcProds FROM catalog_product_entity"),
];

const migratedCats = await Category.countDocuments({ legacyId: { $ne: null } });
const migratedProds = await Product.countDocuments({ legacyId: { $ne: null } });
const orphanProds = await Product.countDocuments({ category: null });

const dupSlugs = await Product.aggregate([
  { $group: { _id: "$slug", n: { $sum: 1 } } },
  { $match: { n: { $gt: 1 } } },
]);

console.log("── Validation ─────────────────────────────");
console.log(`Categories: source(≈) ${srcCats}  →  migrated ${migratedCats}`);
console.log(`Products:   source    ${srcProds}  →  migrated ${migratedProds}`);
console.log(`Products with no category: ${orphanProds}`);
console.log(`Duplicate product slugs:   ${dupSlugs.length}`);
if (dupSlugs.length) console.log("  ", dupSlugs.map((d) => d._id).join(", "));

const ok =
  migratedCats > 0 &&
  migratedProds > 0 &&
  orphanProds === 0 &&
  dupSlugs.length === 0;
console.log(ok ? "\n✅ Validation passed" : "\n⚠️  Review the issues above");

await pool.end();
await disconnectMongo();
process.exitCode = ok ? 0 : 1;
