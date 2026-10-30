import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { resetDb, closeDb } from "./helpers/db.js";
import { startTestServer } from "./helpers/server.js";
import { adminAuth, api } from "./helpers/auth.js";
import { Enquiry } from "../src/db/models/index.js";

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
  await Enquiry.destroy({ where: {} });
});

const form = {
  name: "Asha",
  email: "Asha@Example.com",
  phone: "+91 99999 99999",
  country: "India",
  category: "Essential Oils",
  quantity: "10 kg",
  message: "Need a quote",
  source: "/product/lavender",
};

test("public create stores the enquiry and returns its id", async () => {
  const res = await anon("POST", "/api/public/enquiries", form);
  assert.equal(res.status, 201);
  assert.equal(res.body.message, "Enquiry submitted successfully.");
  const row = await Enquiry.findByPk(Number(res.body.id));
  assert.equal(row.email, "asha@example.com");
  assert.equal(row.status, "new");
});

test("public create validates required fields", async () => {
  const res = await anon("POST", "/api/public/enquiries", { name: "x" });
  assert.equal(res.status, 400);
  assert.equal(res.body.message, "Name and email are required.");
});

test("same email and message within 60s returns the existing record", async () => {
  const first = await anon("POST", "/api/public/enquiries", form);
  const second = await anon("POST", "/api/public/enquiries", form);
  assert.equal(second.status, 200);
  assert.equal(second.body.duplicate, true);
  assert.equal(second.body.id, first.body.id);
  assert.equal(await Enquiry.count(), 1);
});

test("a too-long field is rejected without a row", async () => {
  const res = await anon("POST", "/api/public/enquiries", { ...form, name: "n".repeat(121) });
  assert.equal(res.status, 500);
  assert.equal(await Enquiry.count(), 0);
});

test("captcha is enforced when a secret is configured", async () => {
  process.env.RECAPTCHA_SECRET_KEY = "secret";
  try {
    const res = await anon("POST", "/api/public/enquiries", form);
    assert.equal(res.status, 400);
    assert.equal(res.body.message, "Missing captcha token");
  } finally {
    delete process.env.RECAPTCHA_SECRET_KEY;
  }
});

test("admin routes require a token", async () => {
  assert.equal((await anon("GET", "/api/enquiries")).status, 401);
  assert.equal((await anon("DELETE", "/api/enquiries/1")).status, 401);
});

test("admin list: _id equals id, newest first, no mongo fields", async () => {
  await Enquiry.create({ name: "A", email: "a@x.com" });
  await Enquiry.create({ name: "B", email: "b@x.com" });
  const { status, body } = await admin("GET", "/api/enquiries");
  assert.equal(status, 200);
  assert.deepEqual(body.enquiries.map((e) => e.name), ["B", "A"]);
  const e = body.enquiries[0];
  assert.equal(e._id, e.id);
  assert.equal(typeof e._id, "string");
  assert.equal(e.mongoId, undefined);
  assert.equal(e.status, "new");
  assert.deepEqual([body.total, body.page, body.limit, body.totalPages], [2, 1, 25, 1]);
});

test("admin list: status filter, literal search, limit capped at 100", async () => {
  await Enquiry.create({ name: "Rose 50%", email: "r@x.com", status: "read" });
  await Enquiry.create({ name: "Rose 500", email: "s@x.com" });
  await Enquiry.create({ name: "Lav", email: "l@x.com", country: "France" });

  const read = await admin("GET", "/api/enquiries?status=read");
  assert.deepEqual(read.body.enquiries.map((x) => x.name), ["Rose 50%"]);
  const pct = await admin("GET", "/api/enquiries?q=50%25");
  assert.deepEqual(pct.body.enquiries.map((x) => x.name), ["Rose 50%"]);
  const country = await admin("GET", "/api/enquiries?search=fran");
  assert.deepEqual(country.body.enquiries.map((x) => x.name), ["Lav"]);
  assert.equal((await admin("GET", "/api/enquiries?q=(")).status, 200);
  assert.equal((await admin("GET", "/api/enquiries?limit=500")).body.limit, 100);
});

test("admin update status, bad status 400, missing and garbage ids 404", async () => {
  const row = await Enquiry.create({ name: "A", email: "a@x.com" });
  const ok = await admin("PATCH", `/api/enquiries/${row.id}`, { status: "responded" });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.enquiry.status, "responded");
  assert.equal(ok.body.enquiry._id, String(row.id));

  const bad = await admin("PATCH", `/api/enquiries/${row.id}`, { status: "nonsense" });
  assert.equal(bad.status, 400);
  assert.equal((await Enquiry.findByPk(row.id)).status, "responded");

  for (const id of ["999999", "abc", "64f3a1b2c3d4e5f6a7b8c9d0"]) {
    assert.equal((await admin("PATCH", `/api/enquiries/${id}`, { status: "read" })).status, 404, id);
  }
});

test("admin delete removes the row, second delete is 404", async () => {
  const row = await Enquiry.create({ name: "A", email: "a@x.com" });
  const del = await admin("DELETE", `/api/enquiries/${row.id}`);
  assert.equal(del.status, 200);
  assert.equal(del.body.message, "Enquiry deleted");
  assert.equal((await admin("DELETE", `/api/enquiries/${row.id}`)).status, 404);
});
