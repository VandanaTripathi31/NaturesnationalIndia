import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mapAdmin,
  mapBlog,
  mapCategory,
  mapEnquiry,
  mapProduct,
} from "../scripts/lib/mongoToSqlMappers.js";

const oid = (hex) => ({ toString: () => hex.padEnd(24, "0") });
const when = new Date("2024-03-01T10:20:30.456Z");

test("mapProduct resolves the category and keeps timestamps", () => {
  const cat = oid("aa");
  const { row, missing } = mapProduct(
    {
      _id: oid("p1"),
      name: "Lavender",
      slug: "lavender",
      category: cat,
      benefits: ["a"],
      images: [{ public_id: "", url: "https://x/y.png" }],
      createdAt: when,
      updatedAt: when,
    },
    new Map([[String(cat), 7]]),
  );
  assert.deepEqual(missing, []);
  assert.equal(row.categoryId, 7);
  assert.equal(row.mongoId, "p1".padEnd(24, "0"));
  assert.deepEqual(row.benefits, ["a"]);
  assert.deepEqual(row.uses, []);
  assert.deepEqual(row.specifications, []);
  assert.equal(row.createdAt, when);
  assert.equal(row.description, null);
  assert.equal(row.featured, false);
});

test("mapProduct reports an unknown category instead of dropping it silently", () => {
  const { row, missing } = mapProduct(
    { _id: oid("p2"), name: "X", slug: "x", category: oid("ff") },
    new Map(),
  );
  assert.equal(row.categoryId, null);
  assert.deepEqual(missing, ["ff".padEnd(24, "0")]);
});

test("mapBlog keeps category order and reports unknown categories", () => {
  const a = oid("a1");
  const b = oid("b2");
  const gone = oid("c3");
  const { row, categoryIds, missing } = mapBlog(
    { _id: oid("bl"), title: "T", slug: "Mixed-Case", categories: [b, gone, a], tags: ["t"] },
    new Map([[String(a), 1], [String(b), 2]]),
  );
  assert.deepEqual(categoryIds, [2, 1]);
  assert.deepEqual(missing, [String(gone)]);
  assert.equal(row.slug, "Mixed-Case");
  assert.equal(row.author, "Natures Natural");
});

test("mapCategory turns an empty image subdocument into null", () => {
  const { row } = mapCategory({ _id: oid("c"), name: "N", slug: "n", image: {} });
  assert.equal(row.image, null);
  assert.deepEqual(row.previousSlugs, []);
  assert.equal(row.content, "");
});

test("mapAdmin copies the bcrypt hash untouched and flags a missing one", () => {
  const hash = "$2b$12$abcdefghijklmnopqrstuuabcdefghijklmnopqrstuvwxyz0123456";
  const ok = mapAdmin({ _id: oid("ad"), name: "A", email: "a@x.com", password: hash });
  assert.equal(ok.row.password, hash);
  assert.deepEqual(ok.missing, []);
  const bad = mapAdmin({ _id: oid("ae"), name: "A", email: "b@x.com" });
  assert.deepEqual(bad.missing, ["password"]);
});

test("mapEnquiry defaults status", () => {
  const { row } = mapEnquiry({ _id: oid("e"), name: "N", email: "n@x.com" });
  assert.equal(row.status, "new");
  assert.equal(row.phone, null);
});
