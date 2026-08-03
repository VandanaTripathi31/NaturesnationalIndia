// One-time, idempotent migration that aligns MongoDB category and product
// slugs with the live site's sitemap so every public URL matches exactly.
//
//   Dry run (default — shows every change, writes nothing):
//     node migration/align-slugs.js
//
//   Apply the changes:
//     node migration/align-slugs.js --commit
//
//   Enforce exact product slugs from the real sitemap too (recommended):
//     node migration/align-slugs.js --commit --sitemap ./migration/data/sitemap.xml
//
// Safety:
//   * A JSON backup of every current slug is written to migration/backups/
//     before anything is modified.
//   * Each doc keeps its old slug in `previousSlugs` so old (indexed) URLs
//     can 301-redirect to the new one.
//   * Idempotent — running it again is a no-op once slugs already match.
//   * Never assigns a slug that another document already holds.

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectMongo, disconnectMongo } from "./db/mongo.js";
import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";
import { generateSlug } from "../src/utils/slugify.js";
import {
  CATEGORY_SLUGS,
  CATEGORY_NAME_TO_SLUG,
} from "./data/sitemap-slugs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const COMMIT = args.includes("--commit");
const sitemapFlagIndex = args.indexOf("--sitemap");
const SITEMAP_PATH =
  sitemapFlagIndex !== -1 ? args[sitemapFlagIndex + 1] : null;

const categorySlugSet = new Set(CATEGORY_SLUGS);

// Pull every "*.html" flat slug out of a sitemap.xml (categories excluded so
// what's left is the authoritative product-slug set).
function loadProductSlugsFromSitemap(filePath) {
  if (!filePath) return null;
  const abs = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
  if (!fs.existsSync(abs)) {
    console.warn(`[align-slugs] sitemap not found at ${abs} — skipping exact product enforcement.`);
    return null;
  }
  const xml = fs.readFileSync(abs, "utf-8");
  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1]);
  const products = new Set();
  for (const loc of locs) {
    const url = loc.replace(/^https?:\/\/[^/]+\//, "").replace(/\/$/, "");
    if (!url.endsWith(".html")) continue; // skip static pages/blog
    if (url.includes("/")) continue; // skip nested subcategory pages
    const slug = url.slice(0, -".html".length);
    if (!categorySlugSet.has(slug)) products.add(slug);
  }
  return products;
}

const productSlugSet = loadProductSlugsFromSitemap(SITEMAP_PATH);

function writeBackup(categories, products) {
  const dir = path.join(__dirname, "backups");
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = path.join(dir, `slug-backup-${stamp}.json`);
  fs.writeFileSync(
    file,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        categories: categories.map((c) => ({
          _id: c._id.toString(),
          name: c.name,
          slug: c.slug,
        })),
        products: products.map((p) => ({
          _id: p._id.toString(),
          name: p.name,
          slug: p.slug,
        })),
      },
      null,
      2,
    ),
  );
  return file;
}

// Resolve the canonical slug for a category from its name / current slug.
function resolveCategoryTarget(category) {
  const bySlug = category.slug ? category.slug.toLowerCase() : "";
  const byName = generateSlug(category.name || "");

  if (categorySlugSet.has(bySlug)) return bySlug; // already correct
  if (CATEGORY_NAME_TO_SLUG[bySlug]) return CATEGORY_NAME_TO_SLUG[bySlug];
  if (CATEGORY_NAME_TO_SLUG[byName]) return CATEGORY_NAME_TO_SLUG[byName];
  if (categorySlugSet.has(byName)) return byName;
  return null; // unmatched — reported for manual review
}

// Resolve the canonical slug for a product. If the authoritative product-slug
// set is available, match against it; otherwise keep a clean existing slug.
function resolveProductTarget(product) {
  const current = product.slug ? product.slug.toLowerCase() : "";
  const byName = generateSlug(product.name || "");

  if (productSlugSet) {
    if (productSlugSet.has(current)) return current; // already correct
    if (productSlugSet.has(byName)) return byName;
    // Sitemap sometimes carries a numeric Magento suffix (e.g. "-836").
    const suffixed = [...productSlugSet].find(
      (s) => s.replace(/-\d+$/, "") === current || s.replace(/-\d+$/, "") === byName,
    );
    return suffixed ?? null;
  }

  // No sitemap provided: trust the existing slug if it is already clean,
  // otherwise regenerate from the name.
  if (current && generateSlug(current) === current) return current;
  return byName || null;
}

async function alignCollection(label, docs, resolveTarget, takenSlugs) {
  const changes = [];
  const unmatched = [];

  for (const doc of docs) {
    const target = resolveTarget(doc);

    if (!target) {
      unmatched.push({ id: doc._id.toString(), name: doc.name, slug: doc.slug });
      continue;
    }

    if (target === doc.slug) continue; // idempotent no-op

    if (takenSlugs.has(target)) {
      unmatched.push({
        id: doc._id.toString(),
        name: doc.name,
        slug: doc.slug,
        note: `target "${target}" already taken`,
      });
      continue;
    }

    changes.push({ doc, from: doc.slug, to: target });
    takenSlugs.delete(doc.slug);
    takenSlugs.add(target);
  }

  console.log(`\n=== ${label} ===`);
  console.log(`  total: ${docs.length}  changing: ${changes.length}  unmatched: ${unmatched.length}`);
  for (const c of changes) console.log(`  ~ ${c.from}  ->  ${c.to}   (${c.doc.name})`);
  if (unmatched.length) {
    console.log(`  ! needs manual review:`);
    for (const u of unmatched)
      console.log(`    - ${u.name} [${u.slug}]${u.note ? ` (${u.note})` : ""}`);
  }

  if (COMMIT) {
    for (const c of changes) {
      const prev = new Set(c.doc.previousSlugs || []);
      if (c.from) prev.add(c.from);
      prev.delete(c.to);
      c.doc.slug = c.to;
      c.doc.previousSlugs = [...prev];
      await c.doc.save();
    }
  }

  return { changed: changes.length, unmatched: unmatched.length };
}

async function main() {
  await connectMongo();
  console.log(
    COMMIT
      ? "[align-slugs] COMMIT mode — changes will be written."
      : "[align-slugs] DRY RUN — no changes written. Re-run with --commit to apply.",
  );
  console.log(
    productSlugSet
      ? `[align-slugs] Enforcing ${productSlugSet.size} product slugs from sitemap.`
      : "[align-slugs] No --sitemap given: products keep clean existing slugs.",
  );

  const [categories, products] = await Promise.all([
    Category.find({}),
    Product.find({}),
  ]);

  const backupFile = writeBackup(categories, products);
  console.log(`[align-slugs] Backup written: ${backupFile}`);

  // Seed the "taken" set with every current slug so we never create a clash.
  const takenSlugs = new Set([
    ...categories.map((c) => c.slug),
    ...products.map((p) => p.slug),
  ]);

  const catResult = await alignCollection(
    "Categories",
    categories,
    resolveCategoryTarget,
    takenSlugs,
  );
  const prodResult = await alignCollection(
    "Products",
    products,
    resolveProductTarget,
    takenSlugs,
  );

  console.log("\n=== Summary ===");
  console.log(`  Categories changed: ${catResult.changed}, unmatched: ${catResult.unmatched}`);
  console.log(`  Products changed:   ${prodResult.changed}, unmatched: ${prodResult.unmatched}`);
  if (!COMMIT) console.log("\n  DRY RUN complete — nothing was written.");

  await disconnectMongo();
}

main().catch((err) => {
  console.error("[align-slugs] Failed:", err);
  process.exit(1);
});
