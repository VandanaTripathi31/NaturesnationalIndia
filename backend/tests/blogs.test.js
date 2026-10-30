import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { resetDb, closeDb } from "./helpers/db.js";
import { startTestServer } from "./helpers/server.js";
import { api } from "./helpers/auth.js";
import { Blog, BlogBlogCategory, BlogCategory } from "../src/db/models/index.js";

let server;
let anon;
let news;
let guides;

before(async () => {
  await resetDb();
  server = await startTestServer();
  anon = api(server.baseUrl);
});
after(async () => {
  await server.close();
  await closeDb();
});
beforeEach(async () => {
  await BlogBlogCategory.destroy({ where: {} });
  await Blog.destroy({ where: {} });
  await BlogCategory.destroy({ where: {} });
  news = await BlogCategory.create({ title: "News", slug: "news" });
  guides = await BlogCategory.create({ title: "Guides", slug: "guides" });
});

let day = 0;
async function blog(fields = {}, cats = []) {
  day += 1;
  const b = await Blog.create({
    title: fields.title ?? `Post ${day}`,
    slug: fields.slug ?? `post-${day}`,
    publishedAt: new Date(Date.UTC(2024, 0, day)),
    ...fields,
  });
  for (const [position, c] of cats.entries()) {
    await BlogBlogCategory.create({ blogId: b.id, blogCategoryId: c.id, position });
  }
  return b;
}

test("list: only active, newest published first, summary shape", async () => {
  await blog({ title: "Old", slug: "old" }, [news]);
  await blog({ title: "New", slug: "new", tags: ["oil"], image: { url: "https://x/i.png" } }, [news, guides]);
  await blog({ title: "Draft", slug: "draft", isActive: false });
  const { status, body } = await anon("GET", "/api/public/blogs");
  assert.equal(status, 200);
  assert.deepEqual(body.blogs.map((b) => b.title), ["New", "Old"]);
  assert.deepEqual(body.pagination, { page: 1, limit: 10, total: 2, pages: 1 });
  const first = body.blogs[0];
  assert.deepEqual(Object.keys(first).sort(), [
    "author", "categories", "excerpt", "id", "image", "publishedAt", "slug", "tags", "title",
  ]);
  assert.equal(first.image, "https://x/i.png");
  assert.deepEqual(first.categories.map((c) => c.slug), ["news", "guides"]);
  assert.deepEqual(first.tags, ["oil"]);
  assert.equal(typeof first.id, "string");
});

test("list: pagination", async () => {
  for (let i = 0; i < 3; i += 1) await blog();
  const { body } = await anon("GET", "/api/public/blogs?limit=2&page=2");
  assert.equal(body.blogs.length, 1);
  assert.deepEqual(body.pagination, { page: 2, limit: 2, total: 3, pages: 2 });
});

test("list: search matches title, excerpt and tags literally", async () => {
  await blog({ title: "Rose water", slug: "rose" });
  await blog({ title: "Other", slug: "other", excerpt: "about lavender" });
  await blog({ title: "Tagged", slug: "tagged", tags: ["neroli"] });
  await blog({ title: "Fifty 50% off", slug: "fifty" });
  await blog({ title: "Fifty 500", slug: "fivehundred" });
  const titles = async (q) =>
    (await anon("GET", `/api/public/blogs?search=${encodeURIComponent(q)}`)).body.blogs.map((b) => b.title);
  assert.deepEqual(await titles("rose"), ["Rose water"]);
  assert.deepEqual(await titles("lavender"), ["Other"]);
  assert.deepEqual(await titles("neroli"), ["Tagged"]);
  assert.deepEqual(await titles("50%"), ["Fifty 50% off"]);
  for (const q of ["(", "*", "_", "\\"]) {
    assert.equal((await anon("GET", `/api/public/blogs?search=${encodeURIComponent(q)}`)).status, 200);
  }
});

test("list: filter by category slug and by tag", async () => {
  await blog({ title: "InNews", slug: "innews", tags: ["a"] }, [news]);
  await blog({ title: "InGuides", slug: "inguides", tags: ["b"] }, [guides, news]);
  await blog({ title: "None", slug: "none" });
  const byCat = await anon("GET", "/api/public/blogs?category=guides");
  assert.deepEqual(byCat.body.blogs.map((b) => b.title), ["InGuides"]);
  // the post still lists all of its categories
  assert.deepEqual(byCat.body.blogs[0].categories.map((c) => c.slug), ["guides", "news"]);

  const unknown = await anon("GET", "/api/public/blogs?category=missing");
  assert.deepEqual(unknown.body, {
    blogs: [],
    pagination: { page: 1, limit: 10, total: 0, pages: 0 },
  });

  const byTag = await anon("GET", "/api/public/blogs?tag=a");
  assert.deepEqual(byTag.body.blogs.map((b) => b.title), ["InNews"]);
});

test("detail: exact-case slug, content and meta fallbacks, 404s", async () => {
  await blog({ title: "Upper", slug: "Abc", content: "<p>hi</p>", excerpt: "short" });
  await blog({ title: "Hidden", slug: "hidden", isActive: false });
  const ok = await anon("GET", "/api/public/blogs/Abc");
  assert.equal(ok.status, 200);
  assert.equal(ok.body.blog.content, "<p>hi</p>");
  assert.equal(ok.body.blog.metaTitle, "Upper");
  assert.equal(ok.body.blog.metaDescription, "short");
  assert.equal(ok.body.blog.metaKeywords, "");
  assert.equal((await anon("GET", "/api/public/blogs/abc")).status, 404);
  assert.equal((await anon("GET", "/api/public/blogs/hidden")).status, 404);
  assert.equal((await anon("GET", "/api/public/blogs/missing")).status, 404);
});

test("related: shares a category or a tag, excludes self and drafts, newest first", async () => {
  const main = await blog({ title: "Main", slug: "main", tags: ["t1"] }, [news]);
  await blog({ title: "SameCat", slug: "samecat" }, [news]);
  await blog({ title: "SameTag", slug: "sametag", tags: ["t1", "t2"] });
  await blog({ title: "Unrelated", slug: "unrelated", tags: ["zzz"] }, [guides]);
  await blog({ title: "DraftMatch", slug: "draftmatch", isActive: false }, [news]);
  const { status, body } = await anon("GET", `/api/public/blogs/${main.slug}/related`);
  assert.equal(status, 200);
  assert.deepEqual(body.blogs.map((b) => b.title), ["SameTag", "SameCat"]);

  const limited = await anon("GET", `/api/public/blogs/${main.slug}/related?limit=1`);
  assert.equal(limited.body.blogs.length, 1);

  const none = await anon("GET", "/api/public/blogs/missing/related");
  assert.deepEqual(none.body, { blogs: [] });
});
