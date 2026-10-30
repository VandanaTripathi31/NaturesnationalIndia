# Backend migration: MongoDB Atlas to MariaDB (Sequelize)

Date: 2026-10-30
Status: draft, awaiting approval

## Intent and why

The backend runs on cPanel (Passenger, `backend/app.cjs`). The host blocks outbound TCP 27017, so Mongoose cannot reach MongoDB Atlas from there (verified: all three shard hosts BLOCKED, HTTPS 443 open). The cPanel account has a MariaDB database (`naturesn_natures`, localhost:3306, currently 0 tables).

Move the backend data layer from Mongoose/Atlas to Sequelize/MariaDB so the API runs on cPanel with its own database. The public REST contract stays identical, so the frontend and dashboard keep working with no or minimal change.

Context: the data originally came from Magento (MySQL) into Mongo through scripts in `backend/migration/`. `mysql2` is already a dependency.

## Goals

- All existing routes behave the same: same paths, status codes, JSON shapes, pagination, sorting, search results.
- Existing data (categories, products, blogs, blog categories, enquiries, admin) moves from Atlas to MariaDB with no loss.
- Existing admin password hashes are copied, so admin login keeps working with the same password.
- Frontend (`frontend/`) needs no change. Dashboard (`dashboard/`) needs no change.
- `main` branch and the Mongo code stay untouched and working until cutover is verified.
- Cutover freeze under 30 minutes.

## Non-goals

- No new features, no schema redesign, no API changes.
- No rewrite of the Magento migration scripts in `backend/migration/` beyond what the new migration needs (they stay for history).
- Fixing the Brevo 401 mail key (separate issue).
- Moving image hosting (Cloudinary stays).

## Anti-goals (failure even if it "works")

- Any public route returns a different JSON shape than today.
- Search or slug lookups return different results (for example blog slugs lose case sensitivity).
- Data loss or broken relations (product to category, blog to blog categories).
- `main` or the live site broken during the work.

## Constraints

- Runs on cPanel Node.js (Passenger). Avoid native binaries beyond `mysql2`. Prisma is out.
- cPanel MariaDB is localhost-only. The Mongo-to-SQL script must run on the user's PC (only the PC reaches Atlas).
- Local test database: the user's Docker container `dev-mysql` (`mysql:8.0`, port 3306), shared with other projects. Use a dedicated database (`natures_dev`), never touch other databases. Production is MariaDB, local is MySQL 8: avoid engine-specific features. Final verification happens on cPanel.
- Node ESM project (`"type": "module"`), Express 5.

## Decisions made by the user

- ORM: Sequelize.
- Local DB: the existing Docker MySQL.
- Data move: script writes straight to MariaDB (see Cutover for the fallback).
- Admin hashes: copy as is.
- Live site uses the data: a freeze window, under 30 minutes.

## Design (my calls, change if wrong)

### Branch and layout
- Work on branch `feat/mariadb`. Nothing merges to `main` until the user approves after verification.
- New `backend/src/db/` with the Sequelize instance and model definitions. Existing controllers keep their file names and exports.
- `dbConnection.js` replaced by Sequelize `authenticate()`. Env: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`. No `sync({ alter })` in production. Tables created by one explicit SQL schema file, so cPanel setup is a single phpMyAdmin import.

### Tables
Same names as concepts: `admins`, `categories`, `products`, `blogs`, `blog_categories`, `blog_blog_categories` (join), `enquiries`.
- Primary key: integer auto-increment `id`. Each migrated row also stores `mongoId` (varchar, unique, nullable) for idempotent re-runs and relation mapping.
- Keep `legacyId` columns (unique, nullable).
- Arrays and sub-objects as JSON columns: `benefits`, `uses`, `images`, `specifications`, `previousSlugs`, `tags`, category/blog `image`.
- Long text (`content`, `description`, `overview`, `faqs`, etc.) as `LONGTEXT`/`TEXT`.
- Booleans, timestamps (`createdAt`, `updatedAt`), `publishedAt` as today. Charset `utf8mb4`.
- Blog slug keeps exact case today (Mongo is case-sensitive): use a binary collation (`utf8mb4_bin`) on `blogs.slug`. Other slugs are lowercased already.
- Field length limits from the Mongoose schemas become Sequelize validations, matching error messages where controllers surface them.

### ID and API shape
- Public API already returns `id` as a string; keep it as `String(id)`.
- Admin/enquiry responses that return `_id` keep returning `_id` and `id`, same value. This keeps `dashboard/types/enquiry.ts` working without change.
- ID parsing: `mongoose.Types.ObjectId.isValid` in `productController.js` becomes an integer check. `CastError` handling in `errorMiddleware.js` becomes "invalid id" with the same status and message as today.
- JWT payload `id` changes type. Existing admin tokens become invalid at cutover; admin logs in again (same password).

### Queries
- All current search is case-insensitive regex (no `$text`), with metacharacters escaped. Replace with `LIKE '%term%'` with `%`, `_` and `\` escaped. Collation `utf8mb4_unicode_ci` gives case-insensitive match.
- `populate` becomes Sequelize `include` with the same selected attributes. Blog categories use the join table.
- Blog tag search (regex over an array) becomes a `LIKE` on the JSON text of `tags` (my call; same visible behavior for the frontend search box).
- Sorting, skip/limit, `countDocuments` map one to one. `findByIdAndUpdate`, `findByIdAndDelete`, `save()` map to `update`, `destroy`.
- Admin: password hashing moves from a Mongoose hook to a Sequelize `beforeSave` hook; `password` excluded by default scope, included for login.
- Related products and "drop products whose category is inactive" logic keeps current semantics.

### Data migration script
- New script `backend/scripts/mongo-to-mariadb.js` (run on the user's PC): reads Atlas via the existing Mongoose models/connection, writes to a target SQL DB by env. Idempotent (upsert by `mongoId`), `--dry-run`, per-table counts, relation integrity check, report of mismatches.
- Order: categories, blog_categories, products, blogs (and join rows), enquiries, admins.
- Always run against local Docker first. Same script then targets cPanel if Remote MySQL works; otherwise `mysqldump` the verified local DB and import through phpMyAdmin.

### Testing
- Parity harness: run old (Mongo, `main`) and new (SQL) backends against the same data; request every public GET (categories, category by slug, products list/search/by slug/related, blogs list/by slug/related, health) and diff JSON after normalizing ids and key order. Include odd inputs: search with `(`, `*`, `%`, `_`, empty search, bad slug, bad id, mixed-case blog slug, pagination edges.
- Admin flows by script: login, me, CRUD for category/product (with image upload to Cloudinary using a test file), status toggles, featured toggle, enquiry create (public) / list / update / delete.
- Migration validation: row counts per table equal Mongo counts, every product has a valid category, every blog category link resolved, JSON columns parse, admin hash equal.
- Frontend and dashboard: run both against the SQL backend locally and click through key pages (home, category, product, blog, search; dashboard enquiries, products, categories).
- cPanel smoke test via Postman: health, public categories, one product, login, one enquiry.

### Cutover (runbook, finalized in the plan)
1. Before freeze: schema imported on cPanel MariaDB, new code deployed but not serving, env set.
2. Freeze: pause admin edits and note the time.
3. Final run of the migration script (idempotent, fast), validation.
4. Switch traffic to the new backend, smoke test.
5. Unfreeze. Keep Atlas data untouched for rollback.
- Rollback: point back to the old backend deployment; Atlas is unchanged. Enquiries received after cutover would need copying back by hand (low volume).

## Answered items
1. Live backend runs on another host today (not cPanel). It stays up until cutover, which is also the rollback target.
2. cPanel Remote MySQL: unknown. The plan covers direct-write and dump-and-import.
3. cPanel MariaDB is 10.11.19, so JSON columns work.
4. The user puts the local Docker `dev-mysql` credentials in `backend/.env`; `natures_dev` and `natures_test` get created there.

## Risks
- MySQL 8 local versus MariaDB production: JSON behavior differs (MariaDB stores JSON as LONGTEXT with `JSON_VALID` check). Sequelize `JSON` type works on both; avoid JSON functions in queries.
- Case and accent sensitivity differences between Mongo and SQL collations (mitigated by `utf8mb4_bin` on blog slug and parity tests).
- Text search with `LIKE '%x%'` has no index. Dataset is small (catalog), acceptable.
- Cloudinary uploads in admin flows need real credentials during testing.
