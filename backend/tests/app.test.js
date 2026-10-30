import "./helpers/env.js";
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/server.js";
import { errorHandler } from "../src/middleware/errorMiddleware.js";

let server;
before(async () => {
  server = await startTestServer();
});
after(async () => {
  await server.close();
});

test("GET /api/health returns ok", async () => {
  const res = await fetch(`${server.baseUrl}/api/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: "ok" });
});

test("unknown route returns 404 JSON", async () => {
  const res = await fetch(`${server.baseUrl}/api/nope`);
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { message: "Route not found" });
});

function runHandler(error) {
  const out = {};
  const res = {
    status(code) {
      out.status = code;
      return this;
    },
    json(body) {
      out.body = body;
      return this;
    },
  };
  errorHandler(error, {}, res, () => {});
  return out;
}

test("errorHandler maps a sequelize unique error to 409", () => {
  const out = runHandler({
    name: "SequelizeUniqueConstraintError",
    fields: { uq_categories_slug: "x" },
  });
  assert.equal(out.status, 409);
  assert.match(out.body.message, /already exists/);
});

test("errorHandler maps a sequelize validation error to 400 with first message", () => {
  const out = runHandler({
    name: "SequelizeValidationError",
    errors: [{ message: "Category name is required" }],
  });
  assert.equal(out.status, 400);
  assert.equal(out.body.message, "Category name is required");
});
