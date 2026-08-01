# Magento (MySQL) → MongoDB migration

Migrates the live **Magento 1.x** catalog (`naturesn_natures`) into the new
MongoDB store, reusing the app's real Mongoose models so imported data obeys
the exact same schema/validation as the running site.

## What it migrates

| Magento source | → MongoDB collection |
| --- | --- |
| `catalog_category_entity` + EAV (`_varchar/_text/_int`) | `categories` |
| `catalog_product_entity` + EAV (`_varchar/_text/_int/_decimal`) | `products` |
| `catalog_category_product` | `products.category` (FK → ObjectId) |
| `catalog_product_entity_media_gallery(_value)` | `products.images[]` |

> Scope note: the provided dump contains **only the catalog**. CMS pages,
> blog and enquiries are not present, so they are out of scope here.

## Field mapping (Magento attribute_code → Mongo field)

**Product:** `name`→name · `url_key`→slug · `description`→description ·
`botanical_name`→botanicalName · `origin/country_of_origin`→origin ·
`extraction_method`→extractionMethod · `benefits`→benefits[] · `uses`→uses[] ·
`meta_title`→metaTitle · `meta_description`→metaDescription ·
`meta_keyword`→metaKeywords · `status`(1/2)→isActive · media gallery→images[].

**Category:** `name`→name · `url_key`→slug · `description`→description ·
`meta_*`→meta* · `is_active`→isActive · `image`→image.

Standard codes are fixed; the custom ones (botanical/origin/extraction/
benefits/uses) are best-guess candidate lists in `lib/transform.js`. Run the
discover step first and adjust them if any field comes through empty.

## Transformations & rules

- EAV decoded by joining `eav_attribute` at runtime (no hardcoded IDs).
- Store scope: store-view values override the default (0) scope.
- HTML stripped for plain-text/length-limited fields; meta fields truncated
  to the schema maxlengths (title 70 / desc 160 / keywords 255).
- `benefits`/`uses` split from HTML lists / newlines into `String[]`.
- Integer FK `category_id` → resolved to the migrated Category `_id`.
- **Idempotent & duplicate-proof:** every record is upserted by `legacyId`
  (the Magento `entity_id`), so re-running never creates duplicates.
- Root (1) and Default (2) categories are skipped.

## Setup

```bash
cd backend
npm install                     # pulls in mysql2
cp migration/.env.example migration/.env   # then fill in the values
```

`migration/.env` (git-ignored) — MySQL + MongoDB creds come from here only,
nothing is hardcoded. Enable **cPanel → Remote MySQL** and whitelist the IP
you run this from (or run it via an SSH tunnel to the cPanel host).

## Run order

```bash
npm run migrate:discover   # 1. list real attribute codes + source counts
npm run migrate:dry        # 2. dry run — reads everything, writes nothing
npm run migrate            # 3. live migration (upsert by legacyId)
npm run migrate:validate   # 4. compare source/dest counts + integrity checks
```

Images: `IMAGE_MODE=reference` (default) keeps the existing Magento image
URLs; set `IMAGE_MODE=cloudinary` (+ Cloudinary creds) to re-host copies.

## Rollback

```bash
npm run migrate:rollback            # shows what would be deleted
npm run migrate:rollback -- --confirm   # deletes ONLY legacyId records
```

Because imported docs carry `legacyId`, rollback removes exactly what the
migration added and leaves anything created by hand untouched.

## Logs

Every run writes a timestamped log to `migration/logs/` (git-ignored).
