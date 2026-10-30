// One-off data copy: MongoDB Atlas -> SQL (MariaDB / MySQL).
//
//   node scripts/mongo-to-sql.js [--dry-run] [--target=dev|test|env]
//
// Reads Atlas through MONGO_URI (run it from a machine that can reach Atlas)
// and writes with the Sequelize models to the database named by DB_* in
// backend/.env (or the shell). `--target=test` writes to TEST_DB_NAME.
// Idempotent: rows are upserted by `mongoId`, so it can be re-run for a final
// sync at cutover. Prints per-table counts and exits 1 on any mismatch or
// unresolved reference.
import dotenv from "dotenv";
import { Op } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, "..", ".env"), quiet: true });

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const target = [...args].find((a) => a.startsWith("--target="))?.split("=")[1] ?? "dev";
if (!["dev", "test", "env"].includes(target)) {
  console.error(`Unknown --target=${target} (use dev, test or env)`);
  process.exit(2);
}
if (target === "test") process.env.NODE_ENV = "test";
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not set");
  process.exit(2);
}

const { default: mongoose } = await import("mongoose");
const legacy = {
  Admin: (await import("./legacy-mongo/models/Admin.js")).default,
  Category: (await import("./legacy-mongo/models/Category.js")).default,
  Product: (await import("./legacy-mongo/models/Product.js")).default,
  BlogCategory: (await import("./legacy-mongo/models/BlogCategory.js")).default,
  Blog: (await import("./legacy-mongo/models/Blog.js")).default,
  Enquiry: (await import("./legacy-mongo/models/Enquiry.js")).default,
};
const map = await import("./lib/mongoToSqlMappers.js");

let sql = null;
if (!dryRun) {
  sql = await import("../src/db/models/index.js");
  await sql.sequelize.authenticate();
  const { host, port, database } = sql.sequelize.config;
  console.log(`Target SQL database: ${database} @ ${host}:${port}`);
} else {
  console.log("Dry run: nothing is written.");
}

await mongoose.connect(process.env.MONGO_URI);

const report = [];
const problems = [];
const opts = { validate: false, hooks: false, silent: true };

async function upsert(Model, row) {
  const existing = await Model.findOne({ where: { mongoId: row.mongoId } });
  if (existing) {
    await existing.update(row, opts);
    // Sequelize treats createdAt/updatedAt as read-only on update; keep both in
    // sync with the Mongo values.
    const stale = {};
    for (const key of ["createdAt", "updatedAt"]) {
      if (row[key] && +existing[key] !== +row[key]) stale[key] = row[key];
    }
    if (Object.keys(stale).length) {
      await Model.sequelize
        .getQueryInterface()
        .bulkUpdate(Model.getTableName(), stale, { id: existing.id });
    }
    return existing;
  }
  return Model.create(row, opts);
}

// Copies one collection. `build(doc)` returns the mapper result; rows whose
// `skipWhenMissing` is set are not written. Returns Map(mongoId -> sql id).
async function copy(name, docs, SqlModel, build, { skipWhenMissing = false, after } = {}) {
  const ids = new Map();
  let skipped = 0;
  for (const doc of docs) {
    const result = build(doc);
    if (result.missing.length) {
      problems.push(`${name} ${doc._id}: unresolved ${result.missing.join(", ")}`);
      if (skipWhenMissing) {
        skipped += 1;
        continue;
      }
    }
    if (dryRun) {
      ids.set(String(doc._id), ids.size + 1);
      continue;
    }
    const saved = await upsert(SqlModel, result.row);
    ids.set(String(doc._id), saved.id);
    if (after) await after(saved, result);
  }
  const written = dryRun
    ? ids.size
    : await SqlModel.count({ where: { mongoId: { [Op.ne]: null } } });
  report.push({ table: name, mongo: docs.length, sql: written, skipped });
  if (written !== docs.length - skipped) {
    problems.push(`${name}: expected ${docs.length - skipped} rows in SQL, found ${written}`);
  }
  return ids;
}

try {
  const sqlOr = (name) => sql?.[name];
  const categories = await copy(
    "categories",
    await legacy.Category.find().sort({ _id: 1 }).lean(),
    sqlOr("Category"),
    map.mapCategory,
  );
  const blogCategories = await copy(
    "blog_categories",
    await legacy.BlogCategory.find().sort({ _id: 1 }).lean(),
    sqlOr("BlogCategory"),
    map.mapBlogCategory,
  );
  await copy(
    "products",
    await legacy.Product.find().sort({ _id: 1 }).lean(),
    sqlOr("Product"),
    (doc) => map.mapProduct(doc, categories),
    { skipWhenMissing: true },
  );
  await copy(
    "blogs",
    await legacy.Blog.find().sort({ _id: 1 }).lean(),
    sqlOr("Blog"),
    (doc) => map.mapBlog(doc, blogCategories),
    {
      after: async (saved, result) => {
        await sql.BlogBlogCategory.destroy({ where: { blogId: saved.id } });
        if (result.categoryIds.length) {
          await sql.BlogBlogCategory.bulkCreate(
            result.categoryIds.map((blogCategoryId, position) => ({
              blogId: saved.id,
              blogCategoryId,
              position,
            })),
          );
        }
      },
    },
  );
  await copy(
    "enquiries",
    await legacy.Enquiry.find().sort({ _id: 1 }).lean(),
    sqlOr("Enquiry"),
    map.mapEnquiry,
  );
  await copy(
    "admins",
    await legacy.Admin.find().select("+password").sort({ _id: 1 }).lean(),
    sqlOr("Admin"),
    map.mapAdmin,
    { skipWhenMissing: true },
  );
} finally {
  await mongoose.disconnect();
  if (sql) await sql.sequelize.close();
}

console.table(report);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(` - ${p}`);
  process.exit(1);
}
console.log("\nAll counts match, no unresolved references.");
