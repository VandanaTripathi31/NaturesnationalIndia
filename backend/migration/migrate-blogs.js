// Migrates blog data from a static SQL export of Magento's aheadWorks Blog
// extension (aw_blog, aw_blog_cat, aw_blog_post_cat) into MongoDB.
//
// Unlike migrate-products.js/migrate-categories.js this does NOT connect to
// a live Magento MySQL database — no live blog DB was provided, only a
// point-in-time .sql dump (migration/data/blog-source.sql) — so it parses
// that file directly (see lib/sql-dump.js).
//
// Idempotent: every write is an upsert keyed on the original Magento
// post_id / cat_id (Blog.legacyId / BlogCategory.legacyId), so re-running
// this script updates existing records instead of duplicating them. It
// never touches Product/Category or any other collection.
//
// Usage:
//   node migration/migrate-blogs.js [--dry-run] [--file path/to/dump.sql]

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import dotenv from "dotenv";

import { parseInserts } from "./lib/sql-dump.js";
import { slugify, stripHtml, truncate } from "./lib/transform.js";
import { logger } from "./lib/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const dryRun = process.argv.includes("--dry-run");
const fileArgIdx = process.argv.indexOf("--file");
const sqlPath =
  fileArgIdx !== -1 && process.argv[fileArgIdx + 1]
    ? path.resolve(process.argv[fileArgIdx + 1])
    : path.join(__dirname, "data", "blog-source.sql");

// Blog images were embedded inline in `post_content` via Magento's WYSIWYG
// media directive, e.g. {{media url="wysiwyg/foo.jpg"}}, which resolves to
// {site root}/media/wysiwyg/foo.jpg — never a plain <img src="/media/...">
// like product images.
//
// FIX: this used to default to `process.env.MAGENTO_MEDIA_BASE`, the same
// env var migrate-products.js/lib/transform.js's magentoImageUrl() uses.
// That var is configured for PRODUCT paths, which on this store already
// include their own "/media/catalog/product" prefix baked into the
// attribute value (see migrate-products.js), so operators set
// MAGENTO_MEDIA_BASE to e.g.
// "https://www.naturesnaturalindia.com/media/catalog/product" — the site
// root PLUS that path segment, not just the domain. Reusing it here
// produced URLs like ".../media/catalog/product/media/wysiwyg/foo.jpeg"
// (a real 403 in production — confirmed from the actual failing request),
// because blog WYSIWYG images live at {site root}/media/wysiwyg/..., with
// no "/catalog/product" segment at all. Blog media resolution needs the
// bare site root, so it now reads its own env var (MAGENTO_SITE_URL) and
// deliberately does NOT fall back to the product-scoped
// MAGENTO_MEDIA_BASE — only to the same hardcoded legacy host the
// frontend's image-url.js already uses as its own fallback.
const SITE_BASE =
  process.env.MAGENTO_SITE_URL || "https://www.naturesnaturalindia.com";

function resolveMediaDirectives(html) {
  return html.replace(
    /\{\{media url=(["'])(.*?)\1\}\}/g,
    (_m, _q, relPath) => `${SITE_BASE}/media/${relPath.replace(/^\/+/, "")}`,
  );
}

// Defensive HTML sanitization for migrated third-party content: strip
// <script>/<style> blocks, `javascript:`/`data:` URLs, and inline event
// handler attributes. The source dump has none of these today, but the
// content is rendered with dangerouslySetInnerHTML (same trusted-HTML
// pattern the site already uses for Category.content), so this is applied
// once here rather than trusting the dump blindly.
//
// Also stamps every <img> with referrerpolicy="no-referrer" (see
// components/ui/SafeImage.jsx FIX comment on the frontend side): the
// legacy media host's hotlink protection 403s any image request that
// carries a cross-origin Referer header, which every <img> embedded in
// this HTML sends by default. This only applies to images *inside* the
// article body — the extracted card/hero image (Blog.image) is a plain
// URL string handled by SafeImage/next-image on the frontend, not by
// this attribute.
function sanitizeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"')
    .replace(/(src)\s*=\s*(["'])\s*data:text\/html[^"']*\2/gi, '$1=""')
    .replace(/<img(?![^>]*\breferrerpolicy=)([^>]*)>/gi, '<img$1 referrerpolicy="no-referrer">');
}

// Some posts' WYSIWYG uploads used generic, auto-numbered filenames
// (wysiwyg/1.jpg, wysiwyg/2_3_.jpg, ...) alongside — or instead of —
// descriptive ones (wysiwyg/blog/lavender-essential-oil-img.jpg). The
// numbered ones are far more likely to be stale editor thumbnails that
// collide across posts or were never actually kept on the legacy media
// host, so when a post has more than one embedded image, prefer the
// first descriptive filename over a purely-numeric one rather than
// blindly taking whichever `<img>` happens to come first in the markup.
const GENERIC_FILENAME_RE = /^[0-9_.]+\.(jpe?g|png|gif|webp)$/i;

function extractFirstImage(html) {
  const matches = [...html.matchAll(/<img[^>]+src=(["'])(.*?)\1[^>]*>/gi)].map(
    (m) => m[2],
  );
  if (matches.length === 0) return null;
  const descriptive = matches.find(
    (src) => !GENERIC_FILENAME_RE.test(src.split("/").pop() || ""),
  );
  return descriptive || matches[0];
}

function toDate(mysqlDatetime) {
  if (!mysqlDatetime) return null;
  const d = new Date(String(mysqlDatetime).replace(" ", "T") + "Z");
  return Number.isNaN(d.getTime()) ? null : d;
}

// Blog posts have always been served at `/blog/{identifier}/` on the live
// site, and the identifier is already a clean, unique, URL-safe segment
// (verified against this dump — no spaces, no duplicates). Preserving it
// *verbatim* (case included) is what keeps existing indexed/shared links
// working; lib/transform.js's `slugify` lowercases everything, which would
// silently change e.g. `.../for-Importers-and-Manufacturers/` and break
// that exact URL. Only fall back to a generated slug for the (nonexistent
// today, but possible) case of a blank identifier.
function blogSlug(identifier, title, legacyId) {
  const trimmed = String(identifier || "").trim();
  if (trimmed) return trimmed;
  const fallback = String(title || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return fallback || `post-${legacyId}`;
}

function splitTags(tagsStr) {
  if (!tagsStr) return [];
  return tagsStr
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function migrateBlogs({ dryRun: dry = false } = {}) {
  const stats = {
    categories: { total: 0, created: 0, updated: 0 },
    blogs: { total: 0, published: 0, created: 0, updated: 0, skipped: 0, failed: 0 },
  };

  if (!fs.existsSync(sqlPath)) {
    throw new Error(`Blog SQL dump not found at ${sqlPath}`);
  }
  const sql = fs.readFileSync(sqlPath, "utf8");

  const catRows = parseInserts(sql, "aw_blog_cat");
  const blogRows = parseInserts(sql, "aw_blog");
  const postCatRows = parseInserts(sql, "aw_blog_post_cat");

  const postIdToCatIds = new Map();
  for (const { post_id, cat_id } of postCatRows) {
    if (post_id == null || cat_id == null) continue;
    if (!postIdToCatIds.has(post_id)) postIdToCatIds.set(post_id, []);
    postIdToCatIds.get(post_id).push(cat_id);
  }

  const { default: Blog } = await import("../src/models/Blog.js");
  const { default: BlogCategory } = await import("../src/models/BlogCategory.js");

  // ── Categories first, so posts can resolve their ObjectId refs ─────────
  const catIdToObjectId = new Map();
  const catSlugOwner = new Map();

  for (const row of catRows) {
    stats.categories.total++;
    const legacyId = Number(row.cat_id);
    let slug = slugify(row.identifier || row.title) || `blog-category-${legacyId}`;
    const owner = catSlugOwner.get(slug);
    if (owner !== undefined && owner !== legacyId) slug = `${slug}-${legacyId}`;
    catSlugOwner.set(slug, legacyId);

    const doc = {
      title: row.title,
      slug,
      metaKeywords: truncate(row.meta_keywords, 255),
      metaDescription: truncate(row.meta_description, 255),
      sortOrder: Number(row.sort_order) || 0,
      isActive: true,
      legacyId,
    };

    if (dry) {
      catIdToObjectId.set(legacyId, `dry-run:${legacyId}`);
      continue;
    }

    const existing = await BlogCategory.findOne({ legacyId });
    const saved = await BlogCategory.findOneAndUpdate(
      { legacyId },
      { $set: doc },
      { upsert: true, new: true, runValidators: true },
    );
    catIdToObjectId.set(legacyId, saved._id);
    if (existing) stats.categories.updated++;
    else stats.categories.created++;
  }

  // ── Blog posts ───────────────────────────────────────────────────────
  for (const row of blogRows) {
    stats.blogs.total++;
    try {
      const legacyId = Number(row.post_id);
      const slug = blogSlug(row.identifier, row.title, legacyId);
      const isActive = Number(row.status) === 1;
      if (isActive) stats.blogs.published++;

      const rawContent = resolveMediaDirectives(row.post_content || "");
      const content = sanitizeHtml(rawContent);
      const rawShort = resolveMediaDirectives(row.short_content || "");
      const shortContent = sanitizeHtml(rawShort);

      const excerpt =
        truncate(stripHtml(row.short_content || ""), 500) ||
        truncate(stripHtml(row.post_content || ""), 500);

      const imageSrc = extractFirstImage(shortContent) || extractFirstImage(content);
      const image = imageSrc ? { public_id: "", url: imageSrc } : undefined;

      const categoryObjectIds = (postIdToCatIds.get(row.post_id) || [])
        .map((catId) => catIdToObjectId.get(catId))
        .filter(Boolean);

      const doc = {
        title: row.title,
        slug,
        content,
        excerpt,
        image,
        author: row.user || "Natures Natural",
        categories: dry ? [] : categoryObjectIds,
        tags: splitTags(row.tags),
        metaTitle: truncate(row.title, 70),
        metaDescription: truncate(row.meta_description || excerpt, 255),
        metaKeywords: truncate(row.meta_keywords, 255),
        isActive,
        publishedAt: toDate(row.created_time),
        legacyId,
      };

      if (dry) continue;

      const existing = await Blog.findOne({ legacyId });
      await Blog.findOneAndUpdate(
        { legacyId },
        { $set: doc },
        { upsert: true, new: true, runValidators: true },
      );
      if (existing) stats.blogs.updated++;
      else stats.blogs.created++;
    } catch (err) {
      stats.blogs.failed++;
      logger.error(`Failed post_id=${row.post_id}:`, err.message);
    }
  }

  return stats;
}

// Only run standalone when invoked directly (`node migrate-blogs.js`), not
// when imported by another script/test.
//
// FIX: the naive `import.meta.url === \`file://${process.argv[1]}\`` check
// never matches on Windows — process.argv[1] is a plain filesystem path
// like `C:\Users\...\migrate-blogs.js` while import.meta.url is a proper
// file:// URL like `file:///C:/Users/.../migrate-blogs.js` (forward
// slashes, percent-encoding). String-templating a backslash path onto
// "file://" doesn't produce that, so the guard was always false on
// Windows and `node migrate-blogs.js` silently did nothing — no output
// past the dotenv banner, no error, no writes. pathToFileURL() builds the
// same kind of URL Node itself uses for import.meta.url on every platform.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { connectMongo, disconnectMongo } = await import("./db/mongo.js");

  (async () => {
    logger.info("─".repeat(60));
    logger.info(`Blog migration start — ${dryRun ? "DRY RUN" : "LIVE"}`);
    logger.info(`Source dump: ${sqlPath}`);

    if (!dryRun) {
      await connectMongo();
      logger.ok("Connected to MongoDB");
    }

    try {
      const stats = await migrateBlogs({ dryRun });
      logger.ok(`Categories: ${JSON.stringify(stats.categories)}`);
      logger.ok(`Blogs: ${JSON.stringify(stats.blogs)}`);
      logger.ok(`Migration finished${dryRun ? " (dry run — no writes)" : ""}.`);
    } catch (err) {
      logger.error("Blog migration aborted:", err.stack || err.message);
      process.exitCode = 1;
    } finally {
      if (!dryRun) await disconnectMongo();
    }
  })();
}
