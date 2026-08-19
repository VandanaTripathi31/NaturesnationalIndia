// Automatically downloads every legacy-hosted product/category image into
// ./media-backup so rehost-product-images.js --local-images can upload them
// to Cloudinary — no manual downloading required.
//
// The legacy host (www.naturesnaturalindia.com) now returns 403 to most
// clients, so each image is attempted from two sources, in order:
//   1. The legacy host itself, with full browser-like headers (some WAF
//      rules pass these through even when curl/Cloudinary are blocked).
//   2. The Wayback Machine (web.archive.org), which archived the old
//      Magento site and serves the ORIGINAL image bytes via its `id_`
//      flag — completely unaffected by the legacy host's 403.
//
// Usage:
//   node migration/download-legacy-images.js
//
// Then:
//   node migration/rehost-product-images.js --commit --local-images ./media-backup
//
// Safe to re-run any time: files already in media-backup are skipped, and a
// failure report is written to migration/backups/download-failures.json so
// only the genuinely unrecoverable images (if any) need manual attention.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectMongo, disconnectMongo } from "./db/mongo.js";
import Product from "../src/models/Product.js";
import Category from "../src/models/Category.js";
import { legacyUrlOf } from "./rehost-product-images.js";
import { logger } from "./lib/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const OUT_DIR = path.join(__dirname, "..", "media-backup");
const FAILURE_REPORT = path.join(__dirname, "backups", "download-failures.json");
const CONCURRENCY = 4;

// Headers that make the request indistinguishable from a normal Chrome
// page-load — no Referer (the old hotlink rule), a real UA, and the image
// Accept string browsers send.
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Sec-Fetch-Dest": "image",
  "Sec-Fetch-Mode": "no-cors",
  "Sec-Fetch-Site": "none",
};

function basenameOf(url) {
  return decodeURIComponent(url.split("/").pop() || "").toLowerCase();
}

async function fetchBytes(url, headers = {}) {
  const res = await fetch(url, { headers, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get("content-type") || "";
  const buf = Buffer.from(await res.arrayBuffer());
  // The legacy host and Wayback both return HTML error/notice pages with
  // status 200 sometimes — never save those as an image.
  if (!type.startsWith("image/") || buf.length < 100) {
    throw new Error(`not an image (${type}, ${buf.length} bytes)`);
  }
  return buf;
}

async function fromLegacyHost(url) {
  return fetchBytes(encodeURI(url), BROWSER_HEADERS);
}

async function fromWayback(url) {
  // Ask the availability API for the closest snapshot, then request it with
  // the `id_` flag, which returns the original archived bytes (no Wayback
  // banner/rewriting).
  const api = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
  const res = await fetch(api, { headers: { "User-Agent": BROWSER_HEADERS["User-Agent"] } });
  if (!res.ok) throw new Error(`availability API HTTP ${res.status}`);
  const data = await res.json();
  const snap = data?.archived_snapshots?.closest;
  if (!snap?.url) {
    // No indexed snapshot — still worth trying the generic redirect form,
    // which sometimes finds captures the availability API misses.
    return fetchBytes(
      `https://web.archive.org/web/2id_/${encodeURI(url)}`,
      { "User-Agent": BROWSER_HEADERS["User-Agent"] },
    );
  }
  const snapUrl = snap.url.replace(/\/(\d{14})\//, "/$1id_/");
  return fetchBytes(snapUrl, { "User-Agent": BROWSER_HEADERS["User-Agent"] });
}

async function downloadOne(url, stats, failures) {
  const name = basenameOf(url);
  if (!name) return;
  const dest = path.join(OUT_DIR, name);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    stats.already++;
    return;
  }
  const attempts = [
    ["legacy-host", fromLegacyHost],
    ["wayback", fromWayback],
  ];
  const errors = [];
  for (const [label, fn] of attempts) {
    try {
      const buf = await fn(url);
      fs.writeFileSync(dest, buf);
      stats[label === "wayback" ? "from_wayback" : "from_legacy"]++;
      logger.ok(`${name} <- ${label} (${buf.length} bytes)`);
      return;
    } catch (err) {
      errors.push(`${label}: ${err.message}`);
    }
  }
  stats.failed++;
  failures.push({ url, errors });
  logger.warn(`FAILED ${name} (${errors.join(" | ")})`);
}

function collectHtmlImageUrls(html) {
  if (!html || typeof html !== "string") return [];
  return [...html.matchAll(/<img\b[^>]*?\bsrc=["']([^"']+)["']/gi)].map((m) => m[1]);
}

async function main() {
  await connectMongo();
  const products = await Product.find({}).select("slug images").lean();
  const categories = await Category.find({}).select("slug image content").lean();
  await disconnectMongo();

  const urls = new Set();
  for (const p of products) {
    for (const img of p.images || []) {
      const u = legacyUrlOf(img?.url);
      if (u) urls.add(u);
    }
  }
  for (const c of categories) {
    const u = legacyUrlOf(c.image?.url ?? c.image);
    if (u) urls.add(u);
    for (const src of collectHtmlImageUrls(c.content)) {
      const eu = legacyUrlOf(src);
      if (eu) urls.add(eu);
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  logger.info(`${urls.size} legacy image URL(s) to download -> ${OUT_DIR}`);

  const stats = { already: 0, from_legacy: 0, from_wayback: 0, failed: 0 };
  const failures = [];
  const queue = [...urls];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const url = queue.pop();
      await downloadOne(url, stats, failures);
    }
  });
  await Promise.all(workers);

  fs.mkdirSync(path.dirname(FAILURE_REPORT), { recursive: true });
  fs.writeFileSync(FAILURE_REPORT, JSON.stringify(failures, null, 2));
  logger.ok(`Download stats: ${JSON.stringify(stats, null, 2)}`);
  if (failures.length) {
    logger.warn(`${failures.length} image(s) could not be fetched — see ${FAILURE_REPORT}`);
  }
  logger.info(
    "Next: node migration/rehost-product-images.js --commit --local-images ./media-backup",
  );
}

main().catch((err) => {
  logger.error(err.stack || err.message);
  process.exit(1);
});
