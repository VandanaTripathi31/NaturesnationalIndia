// Re-hosts Product and Category images from the legacy Magento host
// (www.naturesnaturalindia.com) onto Cloudinary, updating MongoDB in place.
//
// WHY: products were migrated with IMAGE_MODE=reference (lib/images.js), so
// MongoDB stores image URLs that still point at the legacy Magento media
// host. That host's bot/hotlink protection has progressively hardened —
// first blocking Next.js's server-side image optimizer, then referrer-
// carrying browser requests, and now (as of the reported regression) plain
// browser requests too, returning 403 for every product image. The frontend
// then falls back to the default placeholder for almost every product. The
// durable fix — the same one already applied to blog images in
// migrate-blogs.js — is to stop depending on the legacy host at request
// time: upload a copy to Cloudinary once, store the Cloudinary URL, done.
//
// Usage:
//   Dry run (default — reports every image it would re-host, writes nothing):
//     node migration/rehost-product-images.js
//
//   Apply:
//     node migration/rehost-product-images.js --commit
//
//   With manually-downloaded originals (recommended — the legacy host is
//   confirmed to block Cloudinary's own remote fetch as well; see the
//   --local-images note in migrate-blogs.js):
//     node migration/rehost-product-images.js --commit --local-images ./media-backup
//
// Behavior:
//   * Only touches images whose URL points at the legacy host (or a bare
//     relative path left over from a MAGENTO_MEDIA_BASE-less migration).
//     Cloudinary URLs and anything else are left untouched → idempotent.
//   * Prefers a local file matched by basename from --local-images
//     (subfolders OK, original filenames preserved); otherwise attempts
//     Cloudinary's remote fetch of the legacy URL as a best effort.
//   * On any failure the stored value is left unchanged, so a partial run
//     never loses data and can simply be re-run.
//   * A JSON backup of every image field it is about to modify is written
//     to migration/backups/ before the first write.

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import dotenv from "dotenv";

import { connectMongo, disconnectMongo } from "./db/mongo.js";
import Product from "../src/models/Product.js";
import Category from "../src/models/Category.js";
import { logger } from "./lib/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const COMMIT = process.argv.includes("--commit");
const localImagesArgIdx = process.argv.indexOf("--local-images");
const localImagesDir =
  localImagesArgIdx !== -1 && process.argv[localImagesArgIdx + 1]
    ? path.resolve(process.argv[localImagesArgIdx + 1])
    : null;

const LEGACY_MEDIA_BASE = "https://www.naturesnaturalindia.com";
const LEGACY_HOST_RE = /(^|\.)naturesnaturalindia\.com$/i;

// ── Local image index (basename, lowercased → absolute path) ──────────
function buildLocalImageIndex(dir) {
  const index = new Map();
  if (!dir) return index;
  if (!fs.existsSync(dir)) {
    logger.warn(`--local-images folder not found: ${dir}`);
    return index;
  }
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else index.set(entry.name.toLowerCase(), full);
    }
  };
  walk(dir);
  logger.info(`--local-images: indexed ${index.size} file(s) from ${dir}`);
  return index;
}

// ── URL classification (mirrors frontend/src/lib/image-url.js) ────────
// Returns the absolute legacy-host URL if this stored value depends on the
// legacy host, else null (already on Cloudinary / elsewhere / empty).
export function legacyUrlOf(value) {
  const url = typeof value === "string" ? value.trim() : "";
  if (!url) return null;
  if (/(^|\/)no_selection\/?$/i.test(url)) return null; // Magento "no image"

  if (/^https?:\/\//i.test(url) || url.startsWith("//")) {
    const abs = url.startsWith("//") ? `https:${url}` : url;
    try {
      return LEGACY_HOST_RE.test(new URL(abs).hostname) ? abs : null;
    } catch {
      return null;
    }
  }
  // Bare relative path from a MAGENTO_MEDIA_BASE-less migration batch —
  // it implicitly points at the legacy host.
  const p = url.startsWith("/") ? url : `/${url}`;
  return `${LEGACY_MEDIA_BASE}${p}`;
}

// ── Cloudinary ────────────────────────────────────────────────────────
let cloudinaryClient = null;
async function getCloudinaryClient() {
  if (cloudinaryClient) return cloudinaryClient;
  const mod = await import("cloudinary");
  cloudinaryClient = mod.v2;
  cloudinaryClient.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinaryClient;
}

const stats = {
  products_scanned: 0,
  categories_scanned: 0,
  images_legacy: 0,
  rehosted: 0,
  from_local_file: 0,
  from_remote_fetch: 0,
  failed: 0,
  docs_updated: 0,
};

// Stable public_id derived from the legacy filename so re-runs overwrite
// nothing and never duplicate assets (`overwrite: false` + fixed id).
export function publicIdFor(legacyUrl) {
  const basename = decodeURIComponent(legacyUrl.split("/").pop() || "");
  return basename
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function rehost(legacyUrl, folder, localImageIndex) {
  const basename = decodeURIComponent(
    legacyUrl.split("/").pop() || "",
  ).toLowerCase();
  const localPath = basename ? localImageIndex.get(basename) : undefined;
  // encodeURI for the remote attempt — Magento filenames may contain raw
  // spaces/parens that are invalid in a URL.
  const uploadSource = localPath || encodeURI(legacyUrl);

  const cld = await getCloudinaryClient();
  const res = await cld.uploader.upload(uploadSource, {
    folder,
    public_id: publicIdFor(legacyUrl),
    use_filename: false,
    unique_filename: false,
    overwrite: false,
  });
  if (localPath) stats.from_local_file++;
  else stats.from_remote_fetch++;
  return { public_id: res.public_id, url: res.secure_url };
}

// Re-host every legacy image in an array of { public_id, url } subdocs.
// Returns the new array, or null when nothing needed changing.
async function rehostImageList(images, folder, localImageIndex, label) {
  let changed = false;
  const out = [];
  for (const img of images) {
    const legacyUrl = legacyUrlOf(img?.url);
    if (!legacyUrl) {
      out.push(img);
      continue;
    }
    stats.images_legacy++;
    if (!COMMIT) {
      logger.info(`DRY would re-host ${label}: ${legacyUrl}`);
      out.push(img);
      continue;
    }
    try {
      const uploaded = await rehost(legacyUrl, folder, localImageIndex);
      out.push(uploaded);
      changed = true;
      stats.rehosted++;
      logger.ok(`re-hosted ${label}: ${legacyUrl} -> ${uploaded.url}`);
    } catch (err) {
      // Keep the stored value untouched — re-runnable, never lossy.
      out.push(img);
      stats.failed++;
      logger.warn(`FAILED ${label}: ${legacyUrl} (${err.message})`);
    }
  }
  return changed ? out : null;
}

async function main() {
  if (COMMIT && !process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error(
      "Cloudinary credentials are not configured (CLOUDINARY_CLOUD_NAME etc.) — cannot re-host.",
    );
  }

  const localImageIndex = buildLocalImageIndex(localImagesDir);
  await connectMongo();
  logger.info(`Mode: ${COMMIT ? "COMMIT" : "DRY RUN"}`);

  const products = await Product.find({}).select("name slug images").lean();
  const categories = await Category.find({}).select("name slug image").lean();

  // Backup of the image fields we may touch, before any write.
  if (COMMIT) {
    const backupDir = path.join(__dirname, "backups");
    fs.mkdirSync(backupDir, { recursive: true });
    const backupPath = path.join(
      backupDir,
      `rehost-images-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
    );
    fs.writeFileSync(
      backupPath,
      JSON.stringify(
        {
          products: products.map((p) => ({ _id: p._id, slug: p.slug, images: p.images })),
          categories: categories.map((c) => ({ _id: c._id, slug: c.slug, image: c.image })),
        },
        null,
        2,
      ),
    );
    logger.info(`Backup written: ${backupPath}`);
  }

  for (const product of products) {
    stats.products_scanned++;
    const updated = await rehostImageList(
      product.images ?? [],
      "naturesnational/products",
      localImageIndex,
      `product ${product.slug}`,
    );
    if (updated) {
      await Product.updateOne({ _id: product._id }, { $set: { images: updated } });
      stats.docs_updated++;
    }
  }

  for (const category of categories) {
    stats.categories_scanned++;
    const updated = await rehostImageList(
      category.image ? [category.image] : [],
      "naturesnational/categories",
      localImageIndex,
      `category ${category.slug}`,
    );
    if (updated) {
      await Category.updateOne({ _id: category._id }, { $set: { image: updated[0] } });
      stats.docs_updated++;
    }
  }

  logger.ok("Re-host stats:", JSON.stringify(stats, null, 2));
  if (!COMMIT) {
    logger.info("Dry run only — re-run with --commit to apply.");
  }
  await disconnectMongo();
}

// Only run when executed directly (keeps legacyUrlOf/publicIdFor importable
// for tests without connecting to anything).
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch(async (err) => {
    logger.error(err.message);
    await disconnectMongo().catch(() => {});
    process.exit(1);
  });
}
