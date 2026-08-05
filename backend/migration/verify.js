// Read-only diagnostic for the Natures Natural India data. Connects with the
// app's MONGO_URI and prints the ground truth for the issues that are DATA,
// not code — so we can see exactly what needs fixing instead of guessing.
//
//   cd backend && node migration/verify.js
//
// Nothing is written. Safe to run against production.

import "dotenv/config";
import { connectMongo, disconnectMongo } from "./db/mongo.js";
import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";
import { generateSlug } from "../src/utils/slugify.js";
import { CATEGORY_NAME_TO_SLUG } from "./data/sitemap-slugs.js";

function line() {
  console.log("─".repeat(64));
}

async function main() {
  await connectMongo();

  const [productCount, categoryCount] = await Promise.all([
    Product.countDocuments({}),
    Category.countDocuments({}),
  ]);

  line();
  console.log(`TOTALS`);
  console.log(`  products:   ${productCount}   (client expects 817)`);
  console.log(`  categories: ${categoryCount}`);

  const categories = await Category.find({}).sort({ name: 1 });

  // ── Per-category product counts ──────────────────────────────────
  line();
  console.log(`PER-CATEGORY PRODUCT COUNTS (active / total)`);
  for (const c of categories) {
    const [active, total] = await Promise.all([
      Product.countDocuments({ category: c._id, isActive: true }),
      Product.countDocuments({ category: c._id }),
    ]);
    const flag = total === 0 ? "  ⚠ NO PRODUCTS" : "";
    console.log(
      `  ${c.name}  [${c.slug}]  id=${c._id}  →  ${active} / ${total}${flag}`,
    );
  }

  // ── Duplicate category names / slugs (duplicate-menu cause) ───────
  line();
  console.log(`DUPLICATE CATEGORIES (cause of duplicate menu entries)`);
  const byName = {};
  const bySlug = {};
  for (const c of categories) {
    (byName[c.name.toLowerCase()] ||= []).push(c.slug);
    (bySlug[c.slug] ||= []).push(String(c._id));
  }
  let dupes = 0;
  for (const [name, slugs] of Object.entries(byName)) {
    if (slugs.length > 1) {
      dupes++;
      console.log(`  name "${name}" appears ${slugs.length}×: ${slugs.join(", ")}`);
    }
  }
  for (const [slug, ids] of Object.entries(bySlug)) {
    if (ids.length > 1) {
      dupes++;
      console.log(`  slug "${slug}" appears ${ids.length}×: ${ids.join(", ")}`);
    }
  }
  if (!dupes) console.log(`  none ✅`);

  // ── Category slugs that don't match the live sitemap ─────────────
  line();
  console.log(`CATEGORY SLUGS NOT MATCHING LIVE SITE (run migrate:slugs to fix)`);
  let mismatches = 0;
  for (const c of categories) {
    const target =
      CATEGORY_NAME_TO_SLUG[c.slug?.toLowerCase()] ||
      CATEGORY_NAME_TO_SLUG[generateSlug(c.name || "")];
    if (target && target !== c.slug) {
      mismatches++;
      console.log(`  "${c.name}"  ${c.slug}  →  ${target}`);
    }
  }
  if (!mismatches) console.log(`  all category slugs already match ✅`);

  // ── Products with missing / empty image URLs (broken images) ─────
  line();
  const noImage = await Product.countDocuments({
    $or: [
      { images: { $size: 0 } },
      { images: { $exists: false } },
      { "images.0.url": { $in: [null, ""] } },
    ],
  });
  console.log(`PRODUCTS WITH NO USABLE IMAGE: ${noImage}`);
  if (noImage > 0) {
    const sample = await Product.find({
      $or: [{ images: { $size: 0 } }, { "images.0.url": { $in: [null, ""] } }],
    })
      .limit(10)
      .select("name slug");
    for (const p of sample) console.log(`  - ${p.name} [${p.slug}]`);
  }

  // ── Seven Chakra Blends focus (client item #2) ───────────────────
  line();
  console.log(`SEVEN CHAKRA BLENDS`);
  const chakra = await Category.findOne({
    $or: [
      { slug: /chakra/i },
      { name: /chakra/i },
    ],
  });
  if (!chakra) {
    console.log(`  ⚠ No category matching /chakra/ found.`);
  } else {
    const count = await Product.countDocuments({ category: chakra._id });
    console.log(`  category: "${chakra.name}" slug=${chakra.slug} id=${chakra._id}`);
    console.log(`  products assigned: ${count}`);
    if (count === 0) {
      // Are there products that *look* like chakra blends but are mis-linked?
      const orphans = await Product.find({ name: /chakra/i })
        .limit(15)
        .select("name slug category isActive");
      console.log(`  products with "chakra" in the name: ${orphans.length}`);
      for (const p of orphans) {
        console.log(
          `    - ${p.name} [${p.slug}] category=${p.category} active=${p.isActive}`,
        );
      }
    }
  }

  line();
  await disconnectMongo();
}

main().catch((err) => {
  console.error("[verify] Failed:", err);
  process.exit(1);
});
