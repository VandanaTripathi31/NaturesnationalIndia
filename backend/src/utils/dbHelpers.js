// Parses a route/query id. Strict on purpose: MySQL casts '64f3a1...' to 64
// in `WHERE id = ?`, so a loose parse could match the wrong row.
export function parseId(value) {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const str = String(value);
  if (!/^[1-9]\d*$/.test(str)) return null;
  const num = Number(str);
  return Number.isSafeInteger(num) && num <= 4294967295 ? num : null;
}

// `%term%` for a LIKE, with the term's own \, % and _ escaped.
export function likeContains(term) {
  return `%${String(term).replace(/[\\%_]/g, "\\$&")}%`;
}

export function isDuplicateKeyError(error) {
  return error?.name === "SequelizeUniqueConstraintError";
}
