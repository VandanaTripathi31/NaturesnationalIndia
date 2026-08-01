// ── Magento 1.x EAV reader ──────────────────────────────────────────────
// Reconstructs full category/product records from the EAV value tables by
// joining `eav_attribute` to resolve numeric attribute_id → attribute_code
// at runtime, so this keeps working even if attribute IDs differ per store.

const BACKEND_TYPES = ["varchar", "text", "int", "decimal", "datetime"];

async function entityTypeId(pool, code) {
  const [rows] = await pool.query(
    "SELECT entity_type_id FROM eav_entity_type WHERE entity_type_code = ?",
    [code],
  );
  if (!rows.length) throw new Error(`entity type ${code} not found`);
  return rows[0].entity_type_id;
}

// Returns Map<entityId, { attribute_code: value }> for one entity type.
// Store-view specific values (storeId) override the default scope (0).
async function readEavValues(pool, entityTypeCode, tablePrefix, storeId) {
  const etId = await entityTypeId(pool, entityTypeCode);
  const byEntity = new Map();

  for (const type of BACKEND_TYPES) {
    const table = `${tablePrefix}_entity_${type}`;
    let rows;
    try {
      [rows] = await pool.query(
        `SELECT a.attribute_code, v.entity_id, v.store_id, v.value
           FROM ${table} v
           JOIN eav_attribute a ON a.attribute_id = v.attribute_id
          WHERE v.store_id IN (0, ?)
          ORDER BY v.store_id ASC`,
        [storeId],
      );
    } catch {
      continue; // table may not exist for this type
    }
    for (const r of rows) {
      if (!byEntity.has(r.entity_id)) byEntity.set(r.entity_id, {});
      // store_id ASC means the specific store (if any) comes last and wins.
      byEntity.get(r.entity_id)[r.attribute_code] = r.value;
    }
  }
  return byEntity;
}

export async function fetchCategories(pool, storeId) {
  const [base] = await pool.query(
    "SELECT entity_id, parent_id, path, position FROM catalog_category_entity",
  );
  const eav = await readEavValues(pool, "catalog_category", "catalog_category", storeId);

  return base.map((c) => ({
    entity_id: c.entity_id,
    parent_id: c.parent_id,
    ...eav.get(c.entity_id),
  }));
}

export async function fetchProducts(pool, storeId) {
  const [base] = await pool.query(
    "SELECT entity_id, sku, created_at, updated_at FROM catalog_product_entity",
  );
  const eav = await readEavValues(pool, "catalog_product", "catalog_product", storeId);

  return base.map((p) => ({
    entity_id: p.entity_id,
    sku: p.sku,
    created_at: p.created_at,
    updated_at: p.updated_at,
    ...eav.get(p.entity_id),
  }));
}

// Map<productEntityId, categoryEntityId[]> (skips root/default categories).
export async function fetchCategoryLinks(pool) {
  const [rows] = await pool.query(
    "SELECT category_id, product_id FROM catalog_category_product ORDER BY position ASC",
  );
  const map = new Map();
  for (const r of rows) {
    if (!map.has(r.product_id)) map.set(r.product_id, []);
    map.get(r.product_id).push(r.category_id);
  }
  return map;
}

// Map<productEntityId, imagePath[]> from the media gallery.
export async function fetchProductImages(pool) {
  const [rows] = await pool.query(
    `SELECT g.entity_id, g.value AS path
       FROM catalog_product_entity_media_gallery g
      WHERE g.value IS NOT NULL AND g.value <> 'no_selection'
      ORDER BY g.value_id ASC`,
  );
  const map = new Map();
  for (const r of rows) {
    if (!map.has(r.entity_id)) map.set(r.entity_id, []);
    map.get(r.entity_id).push(r.path);
  }
  return map;
}
