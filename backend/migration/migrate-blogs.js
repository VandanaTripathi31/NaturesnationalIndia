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
import { fileURLToPath } from "url";
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
// media directive, e.g. {{media url="wysiwyg/foo.jpg"}} — never a plain
// <img src="/media/..."> like product images. Resolve those against the
// same legacy media host the (already-shipped) frontend image-url.js
// fallback uses, so migrated posts render without any new image storage.
const MEDIA_BASE =
  process.env.MAGENTO_MEDIA_BASE || "https://www.naturesnaturalindia.com";

function resolveMediaDirectives(html) {
  return html.replace(
    /\{\{media url=(["'])(.*?)\1\}\}/g,
    (_m, _q, relPath) => `${MEDIA_BASE}/media/${relPath.replace(/^\/+/, "")}`,
  );
}

// Defensive HTML sanitization for migrated third-party content: strip
// <script>/<style> blocks, `javascript:`/`data:` URLs, and inline event
// handler attributes. The source dump has none of these today, but the
// content is rendered with dangerouslySetInnerHTML (same trusted-HTML
// pattern the site already uses for Category.content), so this is applied
// once here rather than trusting the dump blindly.
function sanitizeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"')
    .replace(/(src)\s*=\s*(["'])\s*data:text\/html[^"']*\2/gi, '$1=""');
}

function extractFirstImage(html) {
  const match = html.match(/<img[^>]+src=(["'])(.*?)\1[^>]*>/i);
  return match ? match[2] : null;
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
if (import.meta.url === `file://${process.argv[1]}`) {
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
