import Product from "../src/models/Product.js";
import { fetchProducts, fetchCategoryLinks, fetchProductImages } from "./lib/magento.js";
import { resolveImage } from "./lib/images.js";
import {
  PRODUCT_CODE_MAP,
  pick,
  slugify,
  stripHtml,
  truncate,
  toIsActive,
  toList,
  buildSpecifications,
} from "./lib/transform.js";
import { logger } from "./lib/logger.js";

export async function migrateProducts({ pool, storeId, dryRun, legacyIdToObjectId }) {
  const [rows, categoryLinks, imageMap] = await Promise.all([
    fetchProducts(pool, storeId),
    fetchCategoryLinks(pool),
    fetchProductImages(pool),
  ]);

  const stats = {
    total: 0,
    created: 0,
    updated: 0,
    skipped_no_name: 0,
    skipped_no_category: 0,
    deduped_slug: 0,
    failed: 0,
  };

  // `slug` is a unique index. Magento has a handful of products that share a
  // slug across categories; without this they would collide on insert and be
  // dropped. Track slug → legacyId so the first product keeps the clean slug
  // and later collisions get a stable, deterministic suffix.
  const slugOwner = new Map();

  for (const row of rows) {
    const name = pick(row, PRODUCT_CODE_MAP, "name");
    if (!name) {
      stats.skipped_no_name++;
      continue;
    }

    // Resolve the product's category → the FIRST linked category that we
    // actually migrated (root/default are absent from the map by design).
    const linkedCats = categoryLinks.get(Number(row.entity_id)) || [];
    let categoryObjectId = null;
    for (const catLegacyId of linkedCats) {
      if (legacyIdToObjectId.has(Number(catLegacyId))) {
        categoryObjectId = legacyIdToObjectId.get(Number(catLegacyId));
        break;
      }
    }
    if (!categoryObjectId) {
      stats.skipped_no_category++;
      logger.warn("product has no migrated category", row.entity_id, name);
      continue;
    }

    stats.total++;

    try {
      const legacyId = Number(row.entity_id);
      let slug =
        slugify(pick(row, PRODUCT_CODE_MAP, "slug") || name) || slugify(name);

      // Keep the slug for the product that first claimed it (or re-claimed it
      // on a re-run); suffix any later product with a different legacyId.
      const owner = slugOwner.get(slug);
      if (owner !== undefined && owner !== legacyId) {
        slug = `${slug}-${legacyId}`;
        stats.deduped_slug++;
      }
      slugOwner.set(slug, legacyId);

      // Gallery paths, else the single image attribute as a fallback.
      const paths = imageMap.get(legacyId) || [];
      if (!paths.length) {
        const single = pick(row, PRODUCT_CODE_MAP, "image");
        if (single) paths.push(single);
      }
      const images = [];
      for (const p of paths) {
        const img = await resolveImage(p, "naturesnational/products");
        if (img) images.push(img);
      }

      const doc = {
        name: truncate(name, 160),
        slug,
        description: truncate(
          stripHtml(pick(row, PRODUCT_CODE_MAP, "description")),
          5000,
        ),
        botanicalName: truncate(pick(row, PRODUCT_CODE_MAP, "botanicalName"), 160),
        origin: truncate(pick(row, PRODUCT_CODE_MAP, "origin"), 120),
        extractionMethod: truncate(
          pick(row, PRODUCT_CODE_MAP, "extractionMethod"),
          120,
        ),
        benefits: toList(pick(row, PRODUCT_CODE_MAP, "benefits")),
        uses: toList(pick(row, PRODUCT_CODE_MAP, "uses")),
        metaTitle: truncate(pick(row, PRODUCT_CODE_MAP, "metaTitle"), 70),
        metaDescription: truncate(
          pick(row, PRODUCT_CODE_MAP, "metaDescription"),
          160,
        ),
        metaKeywords: truncate(pick(row, PRODUCT_CODE_MAP, "metaKeywords"), 255),
        isActive: toIsActive(pick(row, PRODUCT_CODE_MAP, "status")),
        productCode: truncate(pick(row, PRODUCT_CODE_MAP, "productCode"), 120),
        blendsWith: stripHtml(pick(row, PRODUCT_CODE_MAP, "blendsWith")),
        history: stripHtml(pick(row, PRODUCT_CODE_MAP, "history")),
        storage: stripHtml(pick(row, PRODUCT_CODE_MAP, "storage")),
        precautions: stripHtml(pick(row, PRODUCT_CODE_MAP, "precautions")),
        faqs: stripHtml(pick(row, PRODUCT_CODE_MAP, "faqs")),
        specifications: buildSpecifications(row),
        category: categoryObjectId,
        images,
        legacyId,
      };

      if (dryRun) {
        stats.created++;
        logger.info("DRY product", doc.legacyId, doc.slug, `(cat ${categoryObjectId})`);
        continue;
      }

      let res;
      try {
        res = await Product.findOneAndUpdate(
          { legacyId: doc.legacyId },
          { $set: doc },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
      } catch (e) {
        // A duplicate-key collision with a pre-existing record (e.g. leftover
        // data from an earlier run) — retry once with a unique slug so the
        // product still imports instead of being dropped.
        if (e.code === 11000) {
          doc.slug = `${doc.slug}-${doc.legacyId}`;
          stats.deduped_slug++;
          res = await Product.findOneAndUpdate(
            { legacyId: doc.legacyId },
            { $set: doc },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );
        } else {
          throw e;
        }
      }
      if (res.createdAt && res.updatedAt && +res.createdAt === +res.updatedAt) {
        stats.created++;
      } else {
        stats.updated++;
      }
    } catch (err) {
      stats.failed++;
      logger.error("product failed", row.entity_id, name, err.message);
    }
  }

  logger.ok("Products:", JSON.stringify(stats));
  return { stats };
}
