# Cutover runbook: Render + Atlas to cPanel + MariaDB

Branch: `feat/mariadb`. Nothing here has been run against production. Every step that
changes production is done by a person, or by Claude only after that person confirms it.

## Where things are today

- Live API: Render, `https://naturesnationalindia.onrender.com`, backed by MongoDB Atlas.
- Frontend and dashboard read the API URL from `NEXT_PUBLIC_API_URL` (frontend `.env`,
  dashboard `.env`). Next.js bakes `NEXT_PUBLIC_*` into the build, so changing it needs a
  rebuild of each app.
- cPanel hosts the new API on MariaDB 10.11 (`naturesn_natures`, `localhost:3306`).
  cPanel cannot reach Atlas (outbound 27017 is blocked), so the data is copied from a
  machine that can: a developer PC.

## What was verified before cutover (local, against a copy of Atlas data)

- `npm test` in `backend/`: 69 of 69 pass.
- `scripts/mongo-to-sql.js`: 22 categories, 21 blog categories, 821 products, 92 blogs,
  104 enquiries, 1 admin copied; second run changes nothing; no orphan products;
  all JSON columns valid.
- `scripts/parity.js`: old Mongo backend vs new SQL backend, 1879 requests, 0 differences
  (public API and admin lists). Two deliberate differences are excluded: related-blog
  cards now carry their category label, and admin search with an invalid regex such as
  `(` no longer errors.
- Frontend: 12 pages rendered against the new API, same content as against the old API.
- Dashboard: login, dashboard, products (821 total), categories, enquiries (104 total) and
  an enquiry status update work against the new API.

## Behavior changes to know about

- All admins must sign in again after cutover (token ids changed type). Same password.
- Deleting a category that still has products returns 409
  "Category has products and cannot be deleted" (before, products were orphaned).
- `PATCH /api/enquiries/:id` with an invalid status returns 400 (before, any string saved).
- Garbage ids (`abc`, old ObjectIds) return 404 instead of a 500.
- Admin search is a literal match, not a regular expression.

## Steps

### 1. Prepare cPanel (no user impact)

1. phpMyAdmin, database `naturesn_natures`: Import `backend/src/db/schema.sql`
   (it only uses `CREATE TABLE IF NOT EXISTS`). Expect 7 tables.
2. cPanel, Setup Node.js App, Environment variables. Set:
   `DB_HOST=localhost`, `DB_PORT=3306`, `DB_NAME=naturesn_natures`, `DB_USER`, `DB_PASS`
   (the MariaDB user assigned to the database), plus the variables the app already uses:
   `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLOUDINARY_*`, `RECAPTCHA_SECRET_KEY`,
   `ENQUIRY_FROM`, `ENQUIRY_TO`, `BREVO_API_KEY`, and
   `FRONTEND_URL` / `DASHBOARD_URL` (comma separated production origins, used for CORS).
   `MONGO_URI` is not needed on cPanel.
3. Build the upload: in `backend/` run `npm run package:cpanel`, zip the contents of
   `backend/cpanel-deploy/` (not the folder), upload and extract into the app folder,
   run "NPM Install" in cPanel, restart the app.
4. Check `https://<api-domain>/api/health` returns `{"status":"ok"}`, and the app log
   shows `Connected to database!`.

### 2. Load the data (pick one)

Option A, direct (needs cPanel Remote MySQL with your PC's IP allowed, port 3306 open):
in `backend/` set `DB_HOST=<cPanel host>`, `DB_NAME`, `DB_USER`, `DB_PASS` in the shell
(they override `.env`) and run `node scripts/mongo-to-sql.js`. Check that it prints
matching counts and "All counts match".

Option B, dump and import (no remote access needed):
1. `node scripts/mongo-to-sql.js` into the local Docker database.
2. Export data only:
   `docker exec dev-mysql mysqldump -u <user> -p --no-create-info --complete-insert --default-character-set=utf8mb4 natures_dev > natures-data.sql`
3. Import `natures-data.sql` through phpMyAdmin into `naturesn_natures`
   (gzip it if it exceeds the upload limit).

Either way, verify on cPanel: `GET /api/public/categories` returns 22 categories and a
product page such as `/api/public/products/<slug>` returns data.

### 3. Freeze and switch (target: under 30 minutes)

1. Announce a short freeze: no admin edits on the dashboard.
2. Re-run the data step (it is idempotent) so the last enquiries and edits are copied.
   Check counts.
3. Smoke test the cPanel API with Postman: health, public categories, one product,
   one blog, login, enquiries list.
4. In the frontend and dashboard, set `NEXT_PUBLIC_API_URL=https://<cPanel API URL>`,
   rebuild and redeploy both. (The old URL stays untouched until step 5.)
5. Smoke test the live site: home, a category, a product, search, a blog, the enquiry form,
   and a dashboard login (admins sign in again).
6. End the freeze.

### 4. Rollback

If anything is wrong after step 3.4: set `NEXT_PUBLIC_API_URL` back to the Render URL,
rebuild and redeploy both apps. Render and Atlas were never changed, so they are the
source of truth until you decide to retire them. Enquiries received on cPanel in the
meantime must be copied to Atlas by hand (low volume).

### 5. After a stable period

Decide separately when to turn off Render and keep or delete the Atlas cluster.
Merge `feat/mariadb` to `main` only after the cutover is confirmed.

## Notes

- The `qa@example.com` account used in local testing exists only in the local
  `natures_dev` database. It is not in Atlas and is not copied anywhere.
- The Brevo 401 (invalid API key) is unrelated to this migration and still needs a new key.
