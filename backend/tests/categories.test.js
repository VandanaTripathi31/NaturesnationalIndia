import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { resetDb, closeDb } from "./helpers/db.js";
import { startTestServer } from "./helpers/server.js";
import { adminAuth, api } from "./helpers/auth.js";
import { Category, Product } from "../src/db/models/index.js";

let server;
let admin;
let anon;

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
});

async function seed(names, extra = {}) {
  const rows = [];
  for (const name of names) {
    rows.push(
      await Category.create({
        name,
        slug: name.toLowerCase().replace(/\W+/g, "-"),
        ...extra,
      }),
    );
  }
  return rows;
}

test("admin routes require a token", async () => {
  assert.equal((await anon("GET", "/api/categories")).status, 401);
});

test("list paginates newest first with the same response shape", async () => {
  await seed(["One", "Two", "Three"]);
  const { status, body } = await admin("GET", "/api/categories?limit=2&page=1");
  assert.equal(status, 200);
  assert.deepEqual(
    body.categories.map((c) => c.name),
    ["Three", "Two"],
  );
  assert.deepEqual(body.pagination, { page: 1, limit: 2, total: 3, totalPages: 2 });
  const first = body.categories[0];
  assert.equal(typeof first.id, "string");
  assert.deepEqual(Object.keys(first).sort(), [
    "content", "createdAt", "description", "id", "image", "isActive",
    "metaDescription", "metaKeywords", "metaTitle", "name", "slug", "updatedAt",
  ]);
  assert.equal(first.image, null);
});

test("list search is literal (% and _ are not wildcards) and status filters", async () => {
  await seed(["Rose 50%", "Rose 500", "Lav_ender", "Lavxender"]);
  const pct = await admin("GET", "/api/categories?search=50%25");
  assert.deepEqual(pct.body.categories.map((c) => c.name), ["Rose 50%"]);
  const us = await admin("GET", "/api/categories?search=v_e");
  assert.deepEqual(us.body.categories.map((c) => c.name), ["Lav_ender"]);
  const paren = await admin("GET", "/api/categories?search=(");
  assert.equal(paren.status, 200);

  await Category.update({ isActive: false }, { where: { name: "Lavxender" } });
  const inactive = await admin("GET", "/api/categories?status=inactive");
  assert.deepEqual(inactive.body.categories.map((c) => c.name), ["Lavxender"]);
});

test("get by id: 200, 404 for missing, 404 for non-numeric (no 500)", async () => {
  const [cat] = await seed(["Solo"]);
  const ok = await admin("GET", `/api/categories/${cat.id}`);
  assert.equal(ok.status, 200);
  assert.equal(ok.body.category.id, String(cat.id));
  assert.equal((await admin("GET", "/api/categories/999999")).status, 404);
  for (const bad of ["abc", "0", "64f3a1b2c3d4e5f6a7b8c9d0", "99999999999999999999"]) {
    assert.equal((await admin("GET", `/api/categories/${bad}`)).status, 404, bad);
  }
});

test("create returns 201, generates slug, rejects duplicate name with 409", async () => {
  const created = await admin("POST", "/api/categories", { name: "Carrier Oils" });
  assert.equal(created.status, 201);
  assert.equal(created.body.category.slug, "carrier-oils");

  const dup = await admin("POST", "/api/categories", { name: "Carrier Oils" });
  // same name gets a unique slug but the name column is unique
  assert.equal(dup.status, 409);
  assert.equal(dup.body.message, "A category with this name or slug already exists");
});

test("update renames, regenerates slug, and 409s on duplicate name", async () => {
  const [a, b] = await seed(["Alpha", "Beta"]);
  const renamed = await admin("PUT", `/api/categories/${a.id}`, { name: "Alpha Prime" });
  assert.equal(renamed.status, 200);
  assert.equal(renamed.body.category.slug, "alpha-prime");
  const clash = await admin("PUT", `/api/categories/${b.id}`, { name: "Alpha Prime" });
  assert.equal(clash.status, 409);
  assert.equal((await admin("PUT", "/api/categories/999999", { name: "Zed" })).status, 404);
});

test("status toggle and delete", async () => {
  const [cat] = await seed(["Togglable"]);
  const off = await admin("PATCH", `/api/categories/${cat.id}/status`, { isActive: false });
  assert.equal(off.status, 200);
  assert.equal(off.body.message, "Category marked as inactive");
  assert.equal(off.body.category.isActive, false);

  const del = await admin("DELETE", `/api/categories/${cat.id}`);
  assert.equal(del.status, 200);
  assert.equal(del.body.message, "Category deleted successfully");
  assert.equal((await admin("DELETE", `/api/categories/${cat.id}`)).status, 404);
});

test("deleting a category that still has products returns 409", async () => {
  const [cat] = await seed(["Busy"]);
  await Product.create({ name: "P", slug: "p", categoryId: cat.id });
  const del = await admin("DELETE", `/api/categories/${cat.id}`);
  assert.equal(del.status, 409);
  assert.equal(del.body.message, "Category has products and cannot be deleted");
});

test("public list: active only, sorted by name, public shape", async () => {
  await seed(["Zinc", "Amber", "Hidden"]);
  await Category.update({ isActive: false }, { where: { name: "Hidden" } });
  const { status, body } = await anon("GET", "/api/public/categories");
  assert.equal(status, 200);
  assert.deepEqual(body.categories.map((c) => c.name), ["Amber", "Zinc"]);
  assert.deepEqual(Object.keys(body.categories[0]).sort(), [
    "content", "description", "id", "image", "metaDescription",
    "metaKeywords", "metaTitle", "name", "slug",
  ]);
  assert.equal(typeof body.categories[0].id, "string");
});
