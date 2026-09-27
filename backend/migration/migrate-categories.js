import Category from "../src/models/Category.js";
import { fetchCategories } from "./lib/magento.js";
import { resolveImage } from "./lib/images.js";
import {
  CATEGORY_CODE_MAP,
  pick,
  slugify,
  stripHtml,
  truncate,
  toIsActive,
} from "./lib/transform.js";
import { logger } from "./lib/logger.js";

// Magento's root (1) and default (2) containers are not real storefront
// categories — skip them.
const SKIP_ENTITY_IDS = new Set([1, 2]);

export async function migrateCategories({ pool, storeId, dryRun }) {
  const rows = await fetchCategories(pool, storeId);
  const legacyIdToObjectId = new Map();
  const stats = { total: 0, created: 0, updated: 0, skipped: 0, deduped: 0, failed: 0 };

  // Both `slug` and `name` are unique indexes; Magento has categories that
  // share them (e.g. two "Seven Chakra Blends"). Track owners so later
  // duplicates get a stable suffix instead of failing the insert — which
  // would orphan every product in that category.
  const slugOwner = new Map();
  const nameOwner = new Map();

  for (const row of rows) {
    if (SKIP_ENTITY_IDS.has(Number(row.entity_id))) continue;

    let name = pick(row, CATEGORY_CODE_MAP, "name");
    if (!name) {
      stats.skipped++;
      continue;
    }
    stats.total++;

    try {
      const legacyId = Number(row.entity_id);
      let slug =
        slugify(pick(row, CATEGORY_CODE_MAP, "slug") || name) || slugify(name);

      const slugHost = slugOwner.get(slug);
      if (slugHost !== undefined && slugHost !== legacyId) {
        slug = `${slug}-${legacyId}`;
        stats.deduped++;
      }
      slugOwner.set(slug, legacyId);

      const nameHost = nameOwner.get(name);
      if (nameHost !== undefined && nameHost !== legacyId) {
        name = `${name} (${legacyId})`;
      }
      nameOwner.set(name, legacyId);

      const image = await resolveImage(
        pick(row, CATEGORY_CODE_MAP, "image"),
        "naturesnational/categories",
      );

      const doc = {
        name: truncate(name, 120),
        slug,
        description: truncate(
          stripHtml(pick(row, CATEGORY_CODE_MAP, "description")),
          1000,
        ),
        metaTitle: truncate(pick(row, CATEGORY_CODE_MAP, "metaTitle"), 70),
        metaDescription: truncate(
          pick(row, CATEGORY_CODE_MAP, "metaDescription"),
          160,
        ),
        metaKeywords: truncate(pick(row, CATEGORY_CODE_MAP, "metaKeywords"), 255),
        isActive: toIsActive(pick(row, CATEGORY_CODE_MAP, "status")),
        legacyId,
        ...(image ? { image } : {}),
      };

      if (dryRun) {
        stats.created++;
        legacyIdToObjectId.set(doc.legacyId, `dry-${doc.legacyId}`);
        logger.info("DRY category", doc.legacyId, doc.slug);
        continue;
      }

      // Upsert by legacyId → idempotent + duplicate-proof across re-runs.
      const res = await Category.findOneAndUpdate(
        { legacyId: doc.legacyId },
        { $set: doc },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      legacyIdToObjectId.set(doc.legacyId, res._id);
      if (res.createdAt && res.updatedAt && +res.createdAt === +res.updatedAt) {
        stats.created++;
      } else {
        stats.updated++;
      }
    } catch (err) {
      stats.failed++;
      logger.error("category failed", row.entity_id, err.message);
    }
  }

  logger.ok("Categories:", JSON.stringify(stats));
  return { legacyIdToObjectId, stats };
}
