// Compares the old (Mongo) and new (SQL) backends request by request.
//
//   node scripts/parity.js --old=http://localhost:5001 --new=http://localhost:5000 \
//        [--email=admin@x.com --password=secret]
//
// Public GETs are built from the old API's own data (every category, product,
// blog) plus fixed edge cases. With --email/--password the admin list
// endpoints are compared too. Ids differ between engines, so `id`, `_id` and
// `__v` are dropped, null and missing are treated alike, and object key order
// is ignored. Array order is compared. Exit 1 on any difference.

const arg = (name) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const OLD = arg("old")?.replace(/\/+$/, "");
const NEW = arg("new")?.replace(/\/+$/, "");
const email = arg("email");
const password = arg("password");
if (!OLD || !NEW) {
  console.error("usage: node scripts/parity.js --old=URL --new=URL [--email= --password=]");
  process.exit(2);
}

const DROP_KEYS = new Set(["id", "_id", "__v", "mongoId"]);

function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      if (DROP_KEYS.has(key)) continue;
      const v = normalize(value[key]);
      if (v === null || v === undefined) continue;
      out[key] = v;
    }
    return out;
  }
  return value;
}

function firstDiff(a, b, path = "$") {
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    return `${path}: ${JSON.stringify(a)?.slice(0, 80)} != ${JSON.stringify(b)?.slice(0, 80)}`;
  }
  if (Array.isArray(a)) {
    if (a.length !== b.length) return `${path}: array length ${a.length} != ${b.length}`;
    for (let i = 0; i < a.length; i += 1) {
      const d = firstDiff(a[i], b[i], `${path}[${i}]`);
      if (d) return d;
    }
    return null;
  }
  if (a && typeof a === "object") {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
      if (!(key in a)) return `${path}.${key}: missing in old`;
      if (!(key in b)) return `${path}.${key}: missing in new`;
      const d = firstDiff(a[key], b[key], `${path}.${key}`);
      if (d) return d;
    }
    return null;
  }
  return a === b ? null : `${path}: ${JSON.stringify(a)?.slice(0, 80)} != ${JSON.stringify(b)?.slice(0, 80)}`;
}

async function get(base, path, headers = {}) {
  try {
    const res = await fetch(base + path, { headers });
    let body = null;
    try {
      body = await res.json();
    } catch {
      /* non-JSON */
    }
    return { status: res.status, body };
  } catch (err) {
    return { status: 0, body: { fetchError: err.message } };
  }
}

const results = { pass: 0, fail: 0 };
const failures = [];

// The old related-blogs endpoint never populated categories (bare ids), the
// new one returns title/slug: a deliberate fix, so that field is not compared.
const IGNORED_BY_PATH = [[/^\/api\/public\/blogs\/[^/?]+\/related/, "categories"]];

function forPath(path, body) {
  const ignored = IGNORED_BY_PATH.filter(([re]) => re.test(path)).map(([, key]) => key);
  if (!ignored.length || !body) return body;
  const strip = (v) =>
    Array.isArray(v)
      ? v.map(strip)
      : v && typeof v === "object"
        ? Object.fromEntries(Object.entries(v).filter(([k]) => !ignored.includes(k)).map(([k, x]) => [k, strip(x)]))
        : v;
  return strip(body);
}

async function compare(path, headers = {}) {
  const [o, n] = await Promise.all([get(OLD, path, headers.old), get(NEW, path, headers.new)]);
  let diff = null;
  if (o.status !== n.status) diff = `status ${o.status} != ${n.status}`;
  else diff = firstDiff(normalize(forPath(path, o.body)), normalize(forPath(path, n.body)));
  if (diff) {
    results.fail += 1;
    failures.push(`${path}\n    ${diff}`);
  } else {
    results.pass += 1;
  }
  return o;
}

async function inPool(items, size, fn) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (queue.length) await fn(queue.shift());
    }),
  );
}

async function pages(path, listKey, pageSize, headers = {}) {
  const found = [];
  for (let page = 1; page < 200; page += 1) {
    const sep = path.includes("?") ? "&" : "?";
    const r = await compare(`${path}${sep}limit=${pageSize}&page=${page}`, headers);
    const rows = r.body?.[listKey] ?? [];
    found.push(...rows);
    if (rows.length < pageSize) break;
  }
  return found;
}

const q = encodeURIComponent;

// ── public ──────────────────────────────────────────────────────────────
const categories = (await compare("/api/public/categories")).body?.categories ?? [];
const productSlugs = new Set();
for (const c of categories) {
  await compare(`/api/public/categories/${c.slug}`);
  const rows = await pages(`/api/public/categories/${c.slug}`, "products", 50);
  rows.forEach((p) => productSlugs.add(p.slug));
}
await inPool([...productSlugs], 8, async (slug) => {
  await compare(`/api/public/products/${slug}`);
  await compare(`/api/public/products/${slug}/related`);
});

const blogs = await pages("/api/public/blogs", "blogs", 50);
await inPool(blogs, 8, async (b) => {
  await compare(`/api/public/blogs/${b.slug}`);
  await compare(`/api/public/blogs/${b.slug}/related`);
});

const searchTerms = ["oil", "lav", "rose", "tea tree", "(", "100", "%", "_", "a", "ro", "\\", "*", "x".repeat(60)];
for (const term of searchTerms) {
  await compare(`/api/public/search?q=${q(term)}`);
  await compare(`/api/public/blogs?search=${q(term)}`);
  if (categories[0]) await compare(`/api/public/categories/${categories[0].slug}?search=${q(term)}`);
}
const tags = new Set(blogs.flatMap((b) => b.tags ?? []));
for (const tag of [...tags].slice(0, 15)) await compare(`/api/public/blogs?tag=${q(tag)}`);
const blogCats = new Set(blogs.flatMap((b) => (b.categories ?? []).map((c) => c.slug)));
for (const slug of blogCats) await compare(`/api/public/blogs?category=${q(slug)}`);

for (const edge of [
  "/api/public/products/does-not-exist",
  "/api/public/products/does-not-exist/related",
  "/api/public/categories/does-not-exist",
  "/api/public/blogs/does-not-exist",
  "/api/public/blogs/does-not-exist/related",
  "/api/public/blogs?category=does-not-exist",
  "/api/public/blogs?limit=2&page=3",
  "/api/public/categories?x=1",
  "/api/health",
  "/api/nope",
]) {
  await compare(edge);
}

// ── admin ───────────────────────────────────────────────────────────────
if (email && password) {
  const login = async (base) => {
    const res = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return { Authorization: `Bearer ${(await res.json()).token}` };
  };
  const headers = { old: await login(OLD), new: await login(NEW) };
  await compare("/api/auth/me", headers);
  await pages("/api/categories", "categories", 50, headers);
  await pages("/api/products", "products", 50, headers);
  await pages("/api/enquiries", "enquiries", 100, headers);
  // "(" is left out here: it was a 500 in the Mongo version (invalid regex).
  for (const term of ["oil", "%"]) {
    await compare(`/api/products?search=${q(term)}&limit=50`, headers);
    await compare(`/api/categories?search=${q(term)}`, headers);
    await compare(`/api/enquiries?q=${q(term)}`, headers);
  }
  await compare("/api/products?status=inactive&limit=50", headers);
  await compare("/api/enquiries?status=new", headers);
} else {
  console.log("(admin endpoints skipped: pass --email and --password)");
}

console.log(`\nparity: ${results.pass} pass, ${results.fail} fail`);
if (failures.length) {
  console.log(failures.slice(0, 40).join("\n"));
  if (failures.length > 40) console.log(`... and ${failures.length - 40} more`);
  process.exit(1);
}
