import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const { createMysqlPool } = await import("./db/mysql.js");
const { connectMongo, disconnectMongo } = await import("./db/mongo.js");
const { migrateCategories } = await import("./migrate-categories.js");
const { migrateProducts } = await import("./migrate-products.js");
const { logger } = await import("./lib/logger.js");

const dryRun = process.argv.includes("--dry-run");
const storeId = Number(process.env.MAGENTO_STORE_ID || 0);

async function main() {
  logger.info("─".repeat(60));
  logger.info(`Migration start — ${dryRun ? "DRY RUN" : "LIVE"} — store ${storeId}`);
  logger.info(`Log file: ${logger.file}`);

  const pool = await createMysqlPool();
  logger.ok("Connected to MySQL");

  await connectMongo();
  logger.ok("Connected to MongoDB");

  try {
    // Two passes: categories first so products can resolve their category
    // ObjectId from the legacyId→_id map returned here.
    const { legacyIdToObjectId } = await migrateCategories({ pool, storeId, dryRun });
    await migrateProducts({ pool, storeId, dryRun, legacyIdToObjectId });
    logger.ok(`Migration finished${dryRun ? " (dry run — no writes)" : ""}.`);
  } catch (err) {
    logger.error("Migration aborted:", err.stack || err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
    await disconnectMongo();
  }
}

main();
