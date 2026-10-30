import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { resetDb, closeDb } from "../helpers/db.js";
import {
  Admin,
  Blog,
  BlogCategory,
  Category,
  Product,
} from "../../src/db/models/index.js";

before(resetDb);
after(closeDb);

async function makeCategory(slug = "essential-oils") {
  return Category.create({ name: slug, slug });
}

test("product round-trips arrays and specifications", async () => {
  const category = await makeCategory("cat-roundtrip");
  const product = await Product.create({
    name: "Lavender",
    slug: "lavender",
    categoryId: category.id,
    benefits: ["calming", "fragrant"],
    images: [{ public_id: "", url: "https://x/y.png" }],
    specifications: [{ label: "CAS No", value: "8000-28-0" }],
  });
  const found = await Product.findByPk(product.id, {
    include: [{ model: Category, as: "category" }],
  });
  assert.deepEqual(found.benefits, ["calming", "fragrant"]);
  assert.deepEqual(found.specifications, [{ label: "CAS No", value: "8000-28-0" }]);
  assert.equal(found.images[0].url, "https://x/y.png");
  assert.equal(found.category.slug, "cat-roundtrip");
  assert.equal(found.toJSON().benefits.length, 2);
});

test("JSON columns default to [] (null for image)", async () => {
  const category = await makeCategory("cat-defaults");
  const product = await Product.create({
    name: "Plain",
    slug: "plain",
    categoryId: category.id,
  });
  const found = await Product.findByPk(product.id);
  assert.deepEqual(found.benefits, []);
  assert.deepEqual(found.images, []);
  assert.deepEqual(found.previousSlugs, []);
  assert.equal(category.image, null);
  assert.equal(found.isActive, true);
  assert.equal(found.featured, false);
});

test("duplicate product slug rejects with a unique constraint error", async () => {
  const category = await makeCategory("cat-dup");
  await Product.create({ name: "A", slug: "dup", categoryId: category.id });
  await assert.rejects(
    Product.create({ name: "B", slug: "dup", categoryId: category.id }),
    (err) => err.name === "SequelizeUniqueConstraintError",
  );
});

test("slugs are trimmed and lowercased; blog slugs keep their case", async () => {
  const category = await Category.create({ name: "Mixed", slug: "  MiXed-Slug " });
  assert.equal(category.slug, "mixed-slug");

  await Blog.create({ title: "Upper", slug: "Abc" });
  await Blog.create({ title: "Lower", slug: "abc" });
  const found = await Blog.findOne({ where: { slug: "abc" } });
  assert.equal(found.title, "Lower");
  const upper = await Blog.findOne({ where: { slug: "Abc" } });
  assert.equal(upper.title, "Upper");
});

test("blog has many blog categories through the join table", async () => {
  const blog = await Blog.create({ title: "Post", slug: "post" });
  const a = await BlogCategory.create({ title: "A", slug: "a" });
  const b = await BlogCategory.create({ title: "B", slug: "b" });
  await blog.addCategories([a, b]);
  const found = await Blog.findByPk(blog.id, {
    include: [{ model: BlogCategory, as: "categories" }],
  });
  assert.deepEqual(found.categories.map((c) => c.slug).sort(), ["a", "b"]);
});

test("validation: length limit and required field messages", async () => {
  await assert.rejects(
    Category.create({ name: "x".repeat(121), slug: "too-long" }),
    /Category name cannot exceed 120 characters/,
  );
  await assert.rejects(Category.create({ slug: "no-name" }), /Category name is required/);
});

test("admin password is hashed, hidden by default, verifiable", async () => {
  await Admin.create({ name: "Root", email: "Root@Example.com", password: "secret1" });
  const plain = await Admin.findOne({ where: { email: "root@example.com" } });
  assert.equal(plain.password, undefined);

  const withPassword = await Admin.scope("withPassword").findOne({
    where: { email: "root@example.com" },
  });
  assert.notEqual(withPassword.password, "secret1");
  assert.match(withPassword.password, /^\$2[aby]\$/);
  assert.equal(await withPassword.comparePassword("secret1"), true);
  assert.equal(await withPassword.comparePassword("wrong"), false);
});

test("timestamps keep millisecond precision", async () => {
  const when = new Date("2024-03-01T10:20:30.456Z");
  const created = await Category.create(
    { name: "Precise", slug: "precise", createdAt: when, updatedAt: when },
    { silent: true },
  );
  const found = await Category.findByPk(created.id);
  assert.equal(found.createdAt.toISOString(), "2024-03-01T10:20:30.456Z");
});
