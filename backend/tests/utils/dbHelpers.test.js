import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isDuplicateKeyError,
  likeContains,
  parseId,
} from "../../src/utils/dbHelpers.js";

test("parseId accepts positive integer ids", () => {
  assert.equal(parseId("12"), 12);
  assert.equal(parseId(7), 7);
});

test("parseId rejects everything else", () => {
  for (const bad of [
    "abc",
    "0",
    "-1",
    "1e3",
    "1.5",
    " 12",
    "64f3a1b2c3d4e5f6a7b8c9d0",
    "99999999999999999999",
    "",
    undefined,
    null,
    {},
  ]) {
    assert.equal(parseId(bad), null, `expected null for ${JSON.stringify(bad)}`);
  }
});

test("likeContains escapes LIKE wildcards", () => {
  assert.equal(likeContains("50%_a\\"), "%50\\%\\_a\\\\%");
  assert.equal(likeContains("plain"), "%plain%");
});

test("isDuplicateKeyError matches sequelize unique errors only", () => {
  assert.equal(isDuplicateKeyError({ name: "SequelizeUniqueConstraintError" }), true);
  assert.equal(isDuplicateKeyError({ code: 11000 }), false);
  assert.equal(isDuplicateKeyError(undefined), false);
});
