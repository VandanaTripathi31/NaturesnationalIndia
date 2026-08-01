import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const { createMysqlPool } = await import("./db/mysql.js");

// Prints the real Magento attribute codes for products & categories plus row
// counts, so you can confirm/adjust the candidate lists in lib/transform.js
// BEFORE running the actual migration. Read-only, safe to run anytime.
const pool = await createMysqlPool();

for (const [label, code] of [
  ["PRODUCT", "catalog_product"],
  ["CATEGORY", "catalog_category"],
]) {
  const [rows] = await pool.query(
    `SELECT a.attribute_code, a.backend_type, a.frontend_label
       FROM eav_attribute a
       JOIN eav_entity_type t ON t.entity_type_id = a.entity_type_id
      WHERE t.entity_type_code = ?
      ORDER BY a.attribute_code`,
    [code],
  );
  console.log(`\n=== ${label} attributes (${rows.length}) ===`);
  for (const r of rows) {
    console.log(
      `  ${r.attribute_code.padEnd(30)} ${String(r.backend_type).padEnd(9)} ${r.frontend_label || ""}`,
    );
  }
}

const [[{ p }]] = [await pool.query("SELECT COUNT(*) p FROM catalog_product_entity")];
const [[{ c }]] = [await pool.query("SELECT COUNT(*) c FROM catalog_category_entity")];
console.log(`\nSource rows → products: ${p}, categories: ${c}`);

await pool.end();
