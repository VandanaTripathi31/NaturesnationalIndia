import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { resetDb, closeDb } from "./helpers/db.js";
import { startTestServer } from "./helpers/server.js";
import { adminAuth, api } from "./helpers/auth.js";
import { Category, Product } from "../src/db/models/index.js";

let server;
let admin;
let anon;
let cat;
let other;

before(async () => {
  await resetDb();
  server = await startTestServer();
  admin = api(server.baseUrl, await adminAuth(server.baseUrl));
  anon = api(server.baseUrl);
});
after(async () => {
  await server.close();
  await closeDb();
});
beforeEach(async () => {
  await Product.destroy({ where: {} });
  await Category.destroy({ where: {} });
  cat = await Category.create({ name: "Essential Oils", slug: "essential-oils" });
  other = await Category.create({ name: "Carrier Oils", slug: "carrier-oils" });
});

let n = 0;
async function product(fields = {}) {
  n += 1;
  const name = fields.name ?? `Product ${n}`;
  return Product.create({
    name,
    slug: name.toLowerCase().replace(/\W+/g, "-"),
    categoryId: cat.id,
    ...fields,
  });
}

test("admin list: pagination, newest first, category populated", async () => {
  await product({ name: "First" });
  await product({ name: "Second" });
  await product({ name: "Third" });
  const { status, body } = await admin("GET", "/api/products?limit=2");
  assert.equal(status, 200);
  assert.deepEqual(body.products.map((p) => p.name), ["Third", "Second"]);
  assert.deepEqual(body.pagination, { page: 1, limit: 2, total: 3, totalPages: 2 });
  const p = body.products[0];
  assert.equal(typeof p.id, "string");
  assert.deepEqual(p.category, {
    id: String(cat.id),
    name: "Essential Oils",
    slug: "essential-oils",
    image: null,
  });
  assert.deepEqual(p.benefits, []);
  assert.deepEqual(p.images, []);
});

test("admin list: search is literal, status and category filters work", async () => {
  await product({ name: "Fenugreek (100ml)" });
  await product({ name: "Rose 50%" });
  await product({ name: "Rose 500" });
  await product({ name: "Argan", categoryId: other.id, isActive: false });

  const paren = await admin("GET", "/api/products?search=(100");
  assert.deepEqual(paren.body.products.map((p) => p.name), ["Fenugreek (100ml)"]);
  const pct = await admin("GET", "/api/products?search=50%25");
  assert.deepEqual(pct.body.products.map((p) => p.name), ["Rose 50%"]);

  const inactive = await admin("GET", "/api/products?status=inactive");
  assert.deepEqual(inactive.body.products.map((p) => p.name), ["Argan"]);
  const byCat = await admin("GET", `/api/products?category=${other.id}`);
  assert.deepEqual(byCat.body.products.map((p) => p.name), ["Argan"]);
  const badCat = await admin("GET", "/api/products?category=abc");
  assert.equal(badCat.body.pagination.total, 4);
});

test("admin get by id: 200 / 404 / garbage ids are 404", async () => {
  const p = await product({ name: "Solo" });
  const ok = await admin("GET", `/api/products/${p.id}`);
  assert.equal(ok.status, 200);
  assert.equal(ok.body.product.slug, "solo");
  for (const id of ["999999", "abc", "0", "64f3a1b2c3d4e5f6a7b8c9d0"]) {
    assert.equal((await admin("GET", `/api/products/${id}`)).status, 404, id);
  }
});

test("create: stores arrays, slug, category ref; validates category", async () => {
  const created = await admin("POST", "/api/products", {
    name: "Lavender Oil",
    category: String(cat.id),
    benefits: ["calming", "fresh"],
    uses: ["aromatherapy"],
    featured: true,
  });
  assert.equal(created.status, 201);
  assert.equal(created.body.product.slug, "lavender-oil");
  assert.deepEqual(created.body.product.benefits, ["calming", "fresh"]);
  assert.equal(created.body.product.featured, true);
  assert.equal(created.body.product.category.slug, "essential-oils");

  const missingCat = await admin("POST", "/api/products", { name: "Ghost", category: "999999" });
  assert.equal(missingCat.status, 404);
  assert.equal(missingCat.body.message, "Category not found");
  const noCat = await admin("POST", "/api/products", { name: "Ghost" });
  assert.equal(noCat.status, 400);
});

test("create: same name gets a unique slug, never a 500", async () => {
  const body = { name: "Twin", category: String(cat.id) };
  const a = await admin("POST", "/api/products", body);
  const b = await admin("POST", "/api/products", body);
  assert.equal(a.status, 201);
  assert.equal(b.status, 201);
  assert.equal(b.body.product.slug, "twin-1");
});

test("update: edits fields, regenerates slug, moves category, 404s", async () => {
  const p = await product({ name: "Old Name" });
  const res = await admin("PUT", `/api/products/${p.id}`, {
    name: "New Name",
    category: String(other.id),
    benefits: ["x"],
    isActive: false,
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.product.slug, "new-name");
  assert.equal(res.body.product.category.id, String(other.id));
  assert.deepEqual(res.body.product.benefits, ["x"]);
  assert.equal(res.body.product.isActive, false);

  assert.equal((await admin("PUT", "/api/products/999999", { name: "Zed" })).status, 404);
  const badCat = await admin("PUT", `/api/products/${p.id}`, { category: "999999" });
  assert.equal(badCat.status, 404);
});

test("status and featured toggles, delete", async () => {
  const p = await product({ name: "Togglable" });
  const off = await admin("PATCH", `/api/products/${p.id}/status`, { isActive: false });
  assert.equal(off.body.message, "Product marked as inactive");
  const feat = await admin("PATCH", `/api/products/${p.id}/featured`, { featured: true });
  assert.equal(feat.body.message, "Product marked as featured");
  assert.equal(feat.body.product.featured, true);

  const del = await admin("DELETE", `/api/products/${p.id}`);
  assert.equal(del.status, 200);
  assert.equal((await admin("DELETE", `/api/products/${p.id}`)).status, 404);
});

test("admin related: same category, active, featured first, excludes self", async () => {
  const main = await product({ name: "Main" });
  await product({ name: "Plain" });
  await product({ name: "Star", featured: true });
  await product({ name: "Off", isActive: false });
  await product({ name: "Elsewhere", categoryId: other.id });
  const { body } = await admin("GET", `/api/products/${main.id}/related`);
  assert.deepEqual(body.products.map((p) => p.name), ["Star", "Plain"]);
});

test("public product by slug: 200 with category, 404 for inactive product or category", async () => {
  await product({ name: "Visible", benefits: ["a"], specifications: [{ label: "L", value: "V" }] });
  const ok = await anon("GET", "/api/public/products/visible");
  assert.equal(ok.status, 200);
  assert.equal(ok.body.product.name, "Visible");
  assert.equal(ok.body.product.category.slug, "essential-oils");
  assert.deepEqual(ok.body.product.specifications, [{ label: "L", value: "V" }]);
  assert.deepEqual(ok.body.product.images, []);

  await product({ name: "Hidden", isActive: false });
  assert.equal((await anon("GET", "/api/public/products/hidden")).status, 404);

  await Category.update({ isActive: false }, { where: { id: cat.id } });
  assert.equal((await anon("GET", "/api/public/products/visible")).status, 404);
});

test("public product resolves an old slug from previousSlugs", async () => {
  await product({ name: "Renamed", previousSlugs: ["legacy-name"] });
  const res = await anon("GET", "/api/public/products/legacy-name");
  assert.equal(res.status, 200);
  assert.equal(res.body.product.slug, "renamed");
  assert.equal((await anon("GET", "/api/public/products/legacy")).status, 404);
});

test("public related: featured first, newest, limit, excludes self and inactive", async () => {
  const main = await product({ name: "Anchor" });
  await product({ name: "R1" });
  await product({ name: "R2", featured: true });
  await product({ name: "R3" });
  const { body } = await anon("GET", `/api/public/products/${main.slug}/related?limit=2`);
  assert.deepEqual(body.products.map((p) => p.name), ["R2", "R3"]);
  assert.equal((await anon("GET", "/api/public/products/nope/related")).status, 404);
});

test("public search: needs 2+ chars, literal match, drops inactive categories", async () => {
  await product({ name: "Tea Tree", botanicalName: "Melaleuca" });
  await product({ name: "Rose 50%" });
  await product({ name: "Rose 500" });
  await product({ name: "Tea Hidden", categoryId: other.id });
  await Category.update({ isActive: false }, { where: { id: other.id } });

  const short = await anon("GET", "/api/public/search?q=a");
  assert.deepEqual(short.body, { query: "a", products: [] });

  const tea = await anon("GET", "/api/public/search?q=tea");
  assert.deepEqual(tea.body.products.map((p) => p.name), ["Tea Tree"]);
  assert.deepEqual(tea.body.products[0].category, { name: "Essential Oils", slug: "essential-oils" });
  assert.equal(tea.body.products[0].image, null);

  const botanical = await anon("GET", "/api/public/search?q=melal");
  assert.equal(botanical.body.products.length, 1);

  const pct = await anon("GET", "/api/public/search?q=50%25");
  assert.deepEqual(pct.body.products.map((p) => p.name), ["Rose 50%"]);

  const cats = await anon("GET", "/api/public/search?q=essential");
  assert.deepEqual(cats.body.categories.map((c) => c.slug), ["essential-oils"]);

  for (const q of ["((", "*+", "_%", "\\\\", "x".repeat(200)]) {
    const res = await anon("GET", `/api/public/search?q=${encodeURIComponent(q)}`);
    assert.equal(res.status, 200, q);
  }
});

test("public category page: products featured first then newest, search, pagination, old slug", async () => {
  await Category.update({ previousSlugs: ["old-eo"] }, { where: { id: cat.id } });
  await product({ name: "Alpha" });
  await product({ name: "Beta (100ml)", featured: true });
  await product({ name: "Gamma" });
  await product({ name: "Elsewhere", categoryId: other.id });

  const res = await anon("GET", "/api/public/categories/essential-oils?limit=2&page=1");
  assert.equal(res.status, 200);
  assert.equal(res.body.category.slug, "essential-oils");
  assert.deepEqual(res.body.products.map((p) => p.name), ["Beta (100ml)", "Gamma"]);
  assert.deepEqual(res.body.pagination, { page: 1, limit: 2, total: 3, totalPages: 2 });

  const search = await anon("GET", "/api/public/categories/essential-oils?search=(100ml)");
  assert.deepEqual(search.body.products.map((p) => p.name), ["Beta (100ml)"]);

  const old = await anon("GET", "/api/public/categories/old-eo");
  assert.equal(old.status, 200);
  assert.equal(old.body.category.slug, "essential-oils");

  assert.equal((await anon("GET", "/api/public/categories/missing")).status, 404);
});

test("public search sorts names in byte order: uppercase before lowercase", async () => {
  await product({ name: "Lavender certified organic" });
  await product({ name: "Lavender Essential" });
  const { body } = await anon("GET", "/api/public/search?q=lavender");
  assert.deepEqual(body.products.map((p) => p.name), [
    "Lavender Essential",
    "Lavender certified organic",
  ]);
});
