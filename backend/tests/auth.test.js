import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { resetDb, closeDb } from "./helpers/db.js";
import { startTestServer } from "./helpers/server.js";
import { Admin } from "../src/db/models/index.js";

let server;
before(async () => {
  await resetDb();
  await Admin.create({ name: "Root", email: "admin@example.com", password: "secret1" });
  server = await startTestServer();
});
after(async () => {
  await server.close();
  await closeDb();
});

const post = (path, body) =>
  fetch(`${server.baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

test("login with valid credentials returns token and admin", async () => {
  const res = await post("/api/auth/login", {
    email: "admin@example.com",
    password: "secret1",
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.token);
  assert.equal(body.admin.email, "admin@example.com");
  assert.equal(typeof body.admin.id, "string");
  assert.equal(body.admin.role, "admin");
  assert.equal(body.admin.password, undefined);
});

test("login with wrong password returns 401", async () => {
  const res = await post("/api/auth/login", {
    email: "admin@example.com",
    password: "nope",
  });
  assert.equal(res.status, 401);
  assert.equal((await res.json()).message, "Invalid email or password");
});

test("login with unknown email returns 401", async () => {
  const res = await post("/api/auth/login", { email: "x@example.com", password: "secret1" });
  assert.equal(res.status, 401);
});

test("login without fields returns 400", async () => {
  const res = await post("/api/auth/login", {});
  assert.equal(res.status, 400);
  assert.equal((await res.json()).message, "Email and password are required");
});

test("/me works with a valid token", async () => {
  const login = await (
    await post("/api/auth/login", { email: "admin@example.com", password: "secret1" })
  ).json();
  const res = await fetch(`${server.baseUrl}/api/auth/me`, {
    headers: { Authorization: `Bearer ${login.token}` },
  });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).admin.email, "admin@example.com");
});

test("/me rejects missing token and old ObjectId-style token ids", async () => {
  const none = await fetch(`${server.baseUrl}/api/auth/me`);
  assert.equal(none.status, 401);

  for (const id of ["64f3a1b2c3d4e5f6a7b8c9d0", "1abc", "0"]) {
    const token = jwt.sign({ id }, process.env.JWT_SECRET);
    const res = await fetch(`${server.baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 401, `id ${id} must be rejected`);
  }
});
