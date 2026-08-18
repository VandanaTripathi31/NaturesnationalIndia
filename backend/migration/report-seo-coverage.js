// Read-only SEO coverage report for Product / Category / Blog.
//
// Per the task's "report before large data changes" requirement: this
// script makes NO writes. It only counts how many records have/are
// missing metaTitle / metaDescription so a real before/after picture
// exists before anyone decides whether a further metadata migration is
// warranted.
//
// Why no NEW SQL→Mongo SEO migration script was written alongside this:
// the product/category migration (migrate-products.js / migrate-categories.js)
// already maps Magento's `meta_title` / `meta_description` / `meta_keyword(s)`
// straight onto Product.metaTitle/metaDescription/metaKeywords and
// Category.metaTitle/metaDescription/metaKeywords (see
// migration/lib/transform.js PRODUCT_CODE_MAP / CATEGORY_CODE_MAP) — the
// exact "seo.metaTitle/metaDescription" structure this task asked for
// already exists, just as flat fields instead of a nested `seo` object,
// which is the project's existing convention. Re-deriving it from a
// second source would risk overwriting already-correct values with
// nothing to reconcile against (this session was given the *blog* SQL
// dump only — no catalog_product_entity/catalog_category_entity data — so
// there is nothing new to migrate from here). What this script answers
// instead is "how complete is what's already there".
//
// Usage: node migration/report-seo-coverage.js

import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const { connectMongo, disconnectMongo } = await import("./db/mongo.js");
const { default: Product } = await import("../src/models/Product.js");
const { default: Category } = await import("../src/models/Category.js");
const { default: Blog } = await import("../src/models/Blog.js");
const { logger } = await import("./lib/logger.js");

function isBlank(v) {
  return v === undefined || v === null || String(v).trim() === "";
}

async function coverage(Model, label, extraFields = []) {
  const total = await Model.countDocuments({});
  const missingTitle = await Model.countDocuments({
    $or: [{ metaTitle: { $exists: false } }, { metaTitle: "" }, { metaTitle: null }],
  });
  const missingDescription = await Model.countDocuments({
    $or: [
      { metaDescription: { $exists: false } },
      { metaDescription: "" },
      { metaDescription: null },
    ],
  });

  const extra = {};
  for (const field of extraFields) {
    extra[`missing_${field}`] = await Model.countDocuments({
      $or: [{ [field]: { $exists: false } }, { [field]: "" }, { [field]: null }],
    });
  }

  logger.info(`── ${label} ──`);
  logger.info(`  Total: ${total}`);
  logger.info(`  With metaTitle: ${total - missingTitle}`);
  logger.info(`  With metaDescription: ${total - missingDescription}`);
  logger.info(`  Missing metaTitle: ${missingTitle}`);
  logger.info(`  Missing metaDescription: ${missingDescription}`);
  for (const [k, v] of Object.entries(extra)) logger.info(`  ${k}: ${v}`);

  return { total, missingTitle, missingDescription, ...extra };
}

async function main() {
  logger.info("─".repeat(60));
  logger.info("SEO coverage report (read-only, no writes)");

  await connectMongo();
  logger.ok("Connected to MongoDB");

  try {
    await coverage(Product, "Products");
    await coverage(Category, "Categories");
    await coverage(Blog, "Blogs", ["image"]);
  } finally {
    await disconnectMongo();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    logger.error("Report failed:", err.stack || err.message);
    process.exitCode = 1;
  });
}
