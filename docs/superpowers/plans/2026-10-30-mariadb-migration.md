# MongoDB to MariaDB Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Mongoose/Atlas with Sequelize/MariaDB in `backend/` with zero change to the public REST contract, then move the data and cut over.

**Architecture:** New `backend/src/db/` layer (Sequelize instance, models, one `schema.sql` as table source of truth). Controllers keep their files and exports; only queries and id handling change. Express app is split into `src/app.js` (`createApp()`) so tests can start it. A one-off script copies Atlas data into SQL. A parity script diffs old (Mongo, `main`) vs new (SQL) JSON for every GET.

**Tech Stack:** Node 24 ESM, Express 5, Sequelize 6, mysql2 (already installed), `node:test`, Docker `dev-mysql` (mysql:8.0) locally, MariaDB 10.11.19 on cPanel.

**Spec:** `docs/superpowers/specs/2026-10-30-mariadb-migration-design.md`

## Global Constraints

- Branch `feat/mariadb`; `main` and Mongo code untouched until the user approves cutover. No commit to `main`.
- No Prisma, no native binaries besides `mysql2`. No `sequelize.sync({ alter })`/`sync({ force })` against any DB except `natures_test` in tests; production tables come from `backend/src/db/schema.sql`.
- Local DBs `natures_dev` and `natures_test` on `dev-mysql` only. Never touch other databases on that container.
- Charset `utf8mb4`; default collation `utf8mb4_unicode_ci`; `blogs.slug` uses `utf8mb4_bin`.
- Primary keys: integer auto-increment `id`. Migrated rows store `mongoId` (varchar(24), unique, nullable). Keep `legacyId` (unique, nullable).
- API responses unchanged: `id` stays a string (`String(row.id)`). Enquiry responses return both `id` and `_id` (same value). No other `_id` anywhere.
- Id parsing is strict: `/^[1-9]\d*$/` only. MySQL casts `'64f3a...'` to `64`, so a loose lookup would match the wrong row.
- Search is case-insensitive `LIKE '%term%'` with `\`, `%`, `_` escaped. No JSON SQL functions in queries (MySQL 8 and MariaDB differ).
- Secrets only in git-ignored `backend/.env`. Never print them.

## Review Focus

- Search term `%`, `_`, `\`, `(`, `*`, empty, 200 chars: must match literally, no wildcard behavior, no 500.
- Ids `abc`, `0`, `-1`, `1e3`, `64f3a1b2c3d4e5f6a7b8c9d0` (old ObjectId), `99999999999999999999`: 400/404 as today, never match a wrong row.
- Old admin JWT (payload id is an ObjectId string) sent after cutover: 401, not 500, not another admin.
- Blog slug `Abc` vs `abc`: distinct rows, exact-case lookup; mixed-case legacy slugs still resolve.
- Sort ties (same `createdAt`, `featured`): SQL order must equal Mongo order. Add `id ASC` as the final tie-breaker.
- Duplicate slug/name on create/update: 409 with today's message, not 500.
- Product whose category is inactive/deleted: dropped from public search exactly as today.
- `images`, `benefits`, `uses`, `specifications`, `tags`, `previousSlugs` null/empty in DB: API returns `[]`, never `null`.

---

## File Structure

- Create `backend/src/db/sequelize.js` — instance from env, `connectDb()`.
- Create `backend/src/db/schema.sql` — all tables.
- Create `backend/src/db/models/{Admin,Category,Product,Blog,BlogCategory,Enquiry}.js`, `backend/src/db/models/index.js` — models and associations.
- Create `backend/src/utils/dbHelpers.js` — `parseId`, `requireId`, `likeContains`.
- Create `backend/src/app.js` — `createApp()`; `server.js` slimmed to env + listen.
- Modify `backend/src/controllers/*.js`, `backend/src/middleware/{authMiddleware,errorMiddleware}.js`, `backend/server.js`, `backend/package.json`, `backend/scripts/package-cpanel.cjs`.
- Move `backend/src/models/*.js` to `backend/scripts/legacy-mongo/models/` (read-only source for the copy script). Delete `backend/dbConnection.js` once unused.
- Create `backend/scripts/mongo-to-sql.js`, `backend/scripts/parity.js`, `backend/tests/**`.
- Create `docs/superpowers/plans/cutover-runbook.md` (Task 12).

---

### Task 1: Branch, dependencies, local databases

**Files:** Modify `backend/package.json`; modify `backend/.env` (git-ignored).

**Interfaces:**
- Produces: env vars `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`, `TEST_DB_NAME`; databases `natures_dev`, `natures_test`; npm scripts `test` (`node --test tests/`).

- [ ] **Step 1:** `git checkout -b feat/mariadb`. Add `sequelize@^6` to dependencies; move `mongoose` to devDependencies (kept only for the copy script). Run `npm install` in `backend/`.
- [ ] **Step 2:** In `backend/.env` add `DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_NAME=natures_dev`, `DB_USER`, `DB_PASS` (the user supplies the Docker credentials; ask if missing), `TEST_DB_NAME=natures_test`. Keep `MONGO_URI`.
- [ ] **Step 3:** Create both databases: `docker exec dev-mysql mysql -u<user> -p<pass> -e "CREATE DATABASE IF NOT EXISTS natures_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE DATABASE IF NOT EXISTS natures_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`. Verify with `SHOW DATABASES`; expected: both listed, other databases unchanged.
- [ ] **Step 4:** Set `"test": "node --test tests/"` in package.json. Commit `chore(backend): add sequelize, test script`.

### Task 2: Schema and models

**Files:** Create `backend/src/db/schema.sql`, `backend/src/db/sequelize.js`, `backend/src/db/models/*.js`, `backend/tests/helpers/db.js`, `backend/tests/db/models.test.js`.

**Interfaces:**
- Produces: `sequelize` and `connectDb(): Promise<void>` from `src/db/sequelize.js` (uses `DB_*`, or `TEST_DB_NAME` when `NODE_ENV==='test'`). `src/db/models/index.js` exports `{ sequelize, Admin, Category, Product, Blog, BlogCategory, Enquiry }`. Associations: `Product.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' })`, `Category.hasMany(Product, { foreignKey: 'categoryId' })`, `Blog.belongsToMany(BlogCategory, { as: 'categories', through: 'blog_blog_categories', foreignKey: 'blogId', otherKey: 'blogCategoryId' })`. `tests/helpers/db.js` exports `resetDb(): Promise<void>` (runs `schema.sql` on `natures_test`, dropping and recreating all tables).
- Table/column rules: columns mirror the Mongoose schemas in `backend/src/models/*.js` one to one (names unchanged, `category` becomes `categoryId`). `createdAt`/`updatedAt` on every table. JSON columns: `benefits`, `uses`, `images`, `specifications`, `previousSlugs`, `tags`, and `image` (category, blog). Long text as `LONGTEXT`: `content`, `description` (product), `overview`, `faqs`, `history`, `storage`, `precautions`, `blendsWith`. `blogs.slug VARCHAR(255) COLLATE utf8mb4_bin UNIQUE`. `admins.password` excluded via `defaultScope`, available through `scope('withPassword')`. Admin `beforeSave` hook hashes with bcrypt cost 12 when the field changed; instance method `comparePassword(candidate): Promise<boolean>`. Length limits from the Mongoose schemas become `validate: { len: [0, N] }` with the same messages. Getters/defaults: JSON columns default `[]` (image: `null`); `isActive` default true; `featured` default false; enquiry `status` enum `new|read|responded|archived`.

- [ ] **Step 1:** Write `tests/db/models.test.js` (fails first): `resetDb()` in `before`. Tests: product with category round-trips arrays and `specifications`; duplicate product slug rejects with `SequelizeUniqueConstraintError`; blogs `Abc` and `abc` both insert and `Blog.findOne({ where: { slug: 'abc' } })` returns only the lowercase one; blog with two categories via `addCategories`; `Admin.create({password:'secret1'})` stores a bcrypt hash and `Admin.findOne()` has no `password` while `Admin.scope('withPassword').findOne()` does and `comparePassword('secret1')` is true; JSON column defaults to `[]`.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL (modules missing).
- [ ] **Step 3:** Implement `schema.sql`, `sequelize.js`, models, `index.js`, `tests/helpers/db.js` per the rules above. `schema.sql` must run unchanged on MySQL 8 and MariaDB 10.11 (plain `JSON` type is accepted by both; `ENGINE=InnoDB`, no generated columns, no `IF NOT EXISTS` on indexes).
- [ ] **Step 4:** Run `npm test`. Expected: all pass. Commit `feat(backend): sequelize models and schema`.

### Task 3: Helpers, app factory, error handling

**Files:** Create `backend/src/utils/dbHelpers.js`, `backend/src/app.js`, `backend/tests/utils/dbHelpers.test.js`, `backend/tests/helpers/server.js`; modify `backend/src/middleware/errorMiddleware.js`, `backend/server.js`.

**Interfaces:**
- Produces: `parseId(value: unknown): number | null` (strict, safe-integer only). `requireId(value): number` (throws an `Error` with `name = 'CastError'` and `statusCode`-less so the existing `CastError` branch still returns 400 "Invalid category id"). `likeContains(term: string): string` returns `%escaped%`. `createApp(): Express` (all middleware and routes from today's `server.js`, no `listen`, no db connect, no mailer or Cloudinary checks). `tests/helpers/server.js` exports `startTestServer(): Promise<{ baseUrl: string, close(): Promise<void> }>`.
- `errorHandler` additions: `SequelizeUniqueConstraintError` returns 409 `A category with this <field> already exists` (field from `error.fields` first key, same wording as today); `SequelizeValidationError` returns 400 with the first validation message.

- [ ] **Step 1:** Tests in `tests/utils/dbHelpers.test.js`: `parseId('12')===12`; `null` for `'abc'`, `'0'`, `'-1'`, `'1e3'`, `'64f3a1b2c3d4e5f6a7b8c9d0'`, `'99999999999999999999'`, `''`, `undefined`; `likeContains('50%_a\\')` equals `'%50\\%\\_a\\\\%'`; `requireId('x')` throws with `name === 'CastError'`.
- [ ] **Step 2:** Run, expect FAIL. Implement helpers. Run, expect PASS.
- [ ] **Step 3:** Move the app setup (CORS allow-list, parsers, `/api/health`, routers, not-found/error handlers) from `server.js` into `createApp()`, unchanged in behavior. `server.js` keeps dotenv, Cloudinary config/verification, `createApp()`, `listen`, `connectDb()` call, `verifyMailer()`. Keep the dynamic-import and top-level-await structure `app.cjs` relies on.
- [ ] **Step 4:** Extend `errorHandler` as specified. Verify `GET /api/health` and unknown route 404 through `startTestServer()` in `tests/app.test.js`. Run `npm test`, expect PASS. Commit `refactor(backend): app factory, db helpers, error mapping`.

### Task 4: Auth

**Files:** Modify `backend/src/controllers/authController.js`, `backend/src/middleware/authMiddleware.js`; test `backend/tests/auth.test.js`.

**Interfaces:**
- Consumes: `Admin` model, `parseId`, `startTestServer`, `resetDb`.
- Produces: `POST /api/auth/login` and `GET /api/auth/me` with today's bodies; JWT payload `id` is `String(admin.id)`; `formatAdmin` returns `id: String(admin.id)`.

- [ ] **Step 1:** Tests: login with valid creds returns `{ token, admin: { id, name, email, role } }`; wrong password 401 `Invalid email or password`; missing fields 400; `/me` with valid token 200; `/me` with a token whose `id` is `64f3a1b2c3d4e5f6a7b8c9d0` (signed with the test secret) returns 401; no token 401.
- [ ] **Step 2:** Run, expect FAIL. Implement: login uses `Admin.scope('withPassword').findOne({ where: { email } })`; middleware uses `parseId(decoded.id)` then `Admin.findByPk`; invalid id returns 401. Run, expect PASS. Commit `feat(backend): auth on sequelize`.

### Task 5: Categories (admin and public)

**Files:** Modify `backend/src/controllers/categoryController.js`, the category parts of `backend/src/controllers/publicController.js`; test `backend/tests/categories.test.js`.

**Interfaces:**
- Consumes: `Category`, `Product`, `requireId`, `likeContains`.
- Produces: unchanged routes and bodies (`/api/categories` list/get/create/update/status/delete, `/api/public/categories`, `/api/public/categories/:slug`). `formatCategory`/`formatPublicCategory` use `String(category.id)`.

- [ ] **Step 1:** Tests (seeded rows via models, admin token via login helper): list pagination (`page`, `limit`, `total`, `totalPages`), `search=%` returns only names containing a literal `%`, `status=active|inactive`, sort `createdAt` desc with `id` desc tie-break; get by id 200/404, id `abc` 400 `Invalid category id`; create without image 201, duplicate name 409 `A category with this name already exists`; update changes slug and pushes the old slug into `previousSlugs`; status toggle; delete; public list returns only active, sorted by name; public by slug 404 for inactive and for an old slug redirect behavior exactly as the current controller does (read it first and pin it).
- [ ] **Step 2:** Run, expect FAIL. Implement: `find` with `[Op.or]` of `LIKE` on the same columns the regex used, `findAndCountAll`, `order: [['createdAt','DESC'],['id','DESC']]`, `findByPk(requireId(id))`, instance `update`/`destroy`. Cloudinary upload/delete calls unchanged. Run, expect PASS. Commit `feat(backend): categories on sequelize`.

### Task 6: Products (admin and public, search, related)

**Files:** Modify `backend/src/controllers/productController.js`, product parts of `backend/src/controllers/publicController.js`; test `backend/tests/products.test.js`.

**Interfaces:**
- Consumes: `Product`, `Category`, `requireId`, `parseId`, `likeContains`.
- Produces: unchanged routes and bodies. `formatProduct`, `formatCategoryRef`, `formatPublicProduct` use `String(x.id)`. The `category` object comes from an `include` with the same attribute lists as each current `populate` (admin list `name slug image isActive`, related `name slug`, public detail as in current `populate`). `buildSearchFilter` returns a Sequelize `where`. The `mongoose.Types.ObjectId.isValid(categoryId)` check becomes `parseId(categoryId) !== null`.

- [ ] **Step 1:** Tests: admin list with `search`, `status`, `categoryId` (`abc` ignored like today), pagination; create requires existing category (404 `Category not found`), arrays stored; update replaces fields, `removedImageIds` handling, slug change records `previousSlugs`; toggle status, toggle featured; delete; get by id and related (`featured` first, then newest, `id` tie-break, limit); public product by slug 200/404, public related, public search (`q`) mixed with category results, products with inactive category excluded, search `(`, `%`, `_`, empty; public category products list `featured` first then `createdAt desc, id asc`.
- [ ] **Step 2:** Run, expect FAIL. Implement per the interfaces. Keep image normalization helpers unchanged (they accept plain objects). `include` must set `required: true` where the old code dropped products with a null populated category. Run, expect PASS. Commit `feat(backend): products on sequelize`.

### Task 7: Blogs (public)

**Files:** Modify `backend/src/controllers/publicBlogController.js`; test `backend/tests/blogs.test.js`.

**Interfaces:**
- Consumes: `Blog`, `BlogCategory`, `likeContains`.
- Produces: unchanged `/api/public/blogs`, `/blogs/:slug`, `/blogs/:slug/related`. List attributes `title slug excerpt image author tags publishedAt` plus `categories` (`title slug` through the join table). Tag search: `LIKE` on the JSON column cast to text (`CAST(tags AS CHAR)`), same behavior in both engines.

- [ ] **Step 1:** Tests: only `isActive` posts; list sorted `publishedAt desc, createdAt desc, id desc`; filter by category slug; `q` matches title, excerpt, tag; `%` literal; slug lookup exact-case (`Abc` found, `abc` not found when only `Abc` exists); related shares a category or a tag, excludes itself, limit.
- [ ] **Step 2:** Run, expect FAIL. Implement. Run, expect PASS. Commit `feat(backend): blogs on sequelize`.

### Task 8: Enquiries

**Files:** Modify `backend/src/controllers/enquiryController.js`; test `backend/tests/enquiries.test.js`.

**Interfaces:**
- Produces: unchanged routes. Add `formatEnquiry(row)` returning all columns plus `id: String(row.id)` and `_id: String(row.id)`; list returns `{ enquiries: formatEnquiry[], total, page, limit, totalPages }`; update returns `{ enquiry }`. The 2-minute duplicate check (`Enquiry.findOne` on recent matching enquiry) keeps its current conditions (read it and translate to `where` with `createdAt: { [Op.gte]: ... }`).

- [ ] **Step 1:** Tests: public create (mock reCAPTCHA by env as the controller does today; read the controller and follow its test hook, add one only if none exists) returns 201 and stores row; list requires admin, filters by `status`, searches across the six fields with literal `%`, limit capped at 100; each item has `_id` equal to `id`; update status; delete 404 for missing; email sending stays fire-and-forget and never fails the request.
- [ ] **Step 2:** Run, expect FAIL. Implement. Run, expect PASS. Commit `feat(backend): enquiries on sequelize`.

### Task 9: Server wiring, packaging, remove Mongo from runtime

**Files:** Modify `backend/server.js`, `backend/scripts/package-cpanel.cjs`, `backend/package.json`; move `backend/src/models/*` to `backend/scripts/legacy-mongo/models/`; delete `backend/dbConnection.js`.

- [ ] **Step 1:** Replace `dbConnection()` with `connectDb()` in `server.js` (log `Connected to database!` on success, `Database connection error:` + message on failure, same as today; process stays up on failure). Update the packaging script to include `src/db` (already under `src`) and drop `dbConnection.js` from the file list. Add `scripts/legacy-mongo` to nothing (excluded).
- [ ] **Step 2:** `grep -rn "mongoose" backend/src backend/server.js backend/config backend/utils` returns nothing. Run `npm test` and `npm run package:cpanel`; expected: all tests pass, `cpanel-deploy/` contains `src/db/schema.sql` and no `mongoose` imports.
- [ ] **Step 3:** Start `npm run dev` against `natures_dev` (schema loaded by hand via the `mysql` client), hit `/api/health` and `/api/public/categories`. Expected: `{"status":"ok"}`, `[]`-style empty result, no errors. Commit `chore(backend): wire sequelize, drop mongoose from runtime`.

### Task 10: Data copy script

**Files:** Create `backend/scripts/mongo-to-sql.js`; test `backend/tests/mongoToSql.test.js` (pure mapping functions only).

**Interfaces:**
- CLI: `node scripts/mongo-to-sql.js [--dry-run] [--target=dev|test|env]` — reads Atlas via `MONGO_URI` using the legacy models; writes via the Task 2 models to the DB named by `--target` (`dev` = `DB_NAME`, default; `env` = `DB_*` as given, used for cPanel). Exports pure mappers `mapCategory(doc)`, `mapProduct(doc, categoryIdByMongoId)`, `mapBlog(doc, blogCategoryIdByMongoId)`, `mapEnquiry(doc)`, `mapAdmin(doc)` returning plain row objects (including `mongoId`).
- Order: categories, blog categories, products, blogs (+ join rows), enquiries, admins. Upsert by `mongoId`. Admin password copied as-is, bypassing the hash hook (`hooks: false`). Missing relation targets are reported and the row skipped, never silently dropped. Output: per-table `mongo count / sql count / skipped`, plus relation integrity check; exit code 1 on any mismatch.

- [ ] **Step 1:** Mapper tests: product with ObjectId category maps to the right `categoryId`; null arrays become `[]`; admin hash unchanged; blog with an unknown category id reports it; timestamps preserved.
- [ ] **Step 2:** Run, expect FAIL. Implement. Run, expect PASS.
- [ ] **Step 3:** Dry-run against Atlas, then real run into `natures_dev`. Expected: counts equal, zero skipped. Run twice; second run changes nothing (idempotent). Commit `feat(backend): mongo to sql copy script`.

### Task 11: Parity check old vs new

**Files:** Create `backend/scripts/parity.js`.

**Interfaces:**
- CLI: `node scripts/parity.js --old=http://localhost:5001 --new=http://localhost:5000 [--email --password]`. Builds the path list from the old API (all categories, products, blogs, plus fixed edge cases from Review Focus), GETs both, strips `id`/`_id`/`__v` recursively, compares deep-equal with array order preserved, prints a per-path PASS/FAIL and the first differing JSON pointer. With credentials it also compares admin list endpoints (`/api/products`, `/api/categories`, `/api/enquiries`). Exit 1 on any FAIL.

- [ ] **Step 1:** Run the old backend from a worktree of `main` (`git worktree add ../natures-main main`, `PORT=5001`, its own `.env` copy) and the new backend (`PORT=5000`, `natures_dev` filled by Task 10). Run the script. Expected: every path PASS. Investigate each FAIL (ordering ties and null vs `[]` are the likely ones), fix in the controller, add a regression test, rerun.
- [ ] **Step 2:** Commit `test(backend): parity script`.

### Task 12: Frontend and dashboard verification, deploy files, cutover runbook

**Files:** Create `docs/superpowers/plans/cutover-runbook.md`; no frontend/dashboard code changes unless a check fails.

- [ ] **Step 1:** Point the frontend (`NEXT_PUBLIC_*` API base, as its README states) and dashboard at `http://localhost:5000`. Click through: home, a category, a product, search, blog list/detail, enquiry form (with captcha test setup), dashboard login, products list/edit, category edit, enquiries list/status/delete. Expected: no console or network errors, content identical to the old backend. Record results in the runbook.
- [ ] **Step 2:** `grep -rn "_id" frontend/src frontend/app dashboard --include=*.{js,jsx,ts,tsx} | grep -v node_modules` shows only `dashboard/types/enquiry.ts` and the enquiries page/table (served by the compat `_id`).
- [ ] **Step 3:** Write the runbook: (a) on cPanel create tables by importing `src/db/schema.sql` in phpMyAdmin into `naturesn_natures`; (b) set env vars in cPanel Node.js app (`DB_HOST=localhost`, `DB_PORT=3306`, `DB_NAME`, `DB_USER`, `DB_PASS`, plus existing vars); (c) data: `mongo-to-sql.js --target=env` from the PC if Remote MySQL works, else `mysqldump --no-create-info --complete-insert natures_dev` and import in phpMyAdmin; (d) freeze, final copy run, `validate` counts, deploy, restart, Postman smoke (health, public categories, one product, login, one enquiry); (e) rollback (old host unchanged, Atlas untouched; new enquiries after cutover copied back by hand); (f) note that all admin sessions must log in again. Commit `docs: cutover runbook`.

### Task 13: cPanel deployment and cutover (user-gated)

- [ ] **Step 1:** With the user's approval, follow the runbook. Do not run steps that change production (cPanel DB import, env changes, traffic switch) without the user confirming each one.
- [ ] **Step 2:** After the smoke test passes, report results and ask the user whether to merge `feat/mariadb` into `main`.

---

## Self-review notes

- Spec coverage: schema/ids/JSON/collation (T2), `_id` compat and strict ids (T3, T8), search (T3 to T8), admin hash copy (T10), parity and frontend/dashboard check (T11, T12), cutover and rollback (T12, T13). Brevo and Cloudinary are untouched (non-goals).
- `seed:admin` in `package.json` points at a missing `scripts/seedAdmin.js` (pre-existing); out of scope, admins come from the copy script.
- Enquiry responses lose Mongoose `__v`; the dashboard does not read it.
