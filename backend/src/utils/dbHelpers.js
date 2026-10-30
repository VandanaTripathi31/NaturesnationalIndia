import { Op, literal } from "sequelize";

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

// Finds the row served under `slug`, falling back to rows that used it as a
// previous slug (so old indexed URLs keep resolving). `previousSlugs` holds a
// JSON array in a text column, so match the quoted element and re-check it.
export async function findBySlugOrPrevious(Model, slug, options = {}) {
  const { where = {}, ...rest } = options;
  const direct = await Model.findOne({ where: { ...where, slug }, ...rest });
  if (direct) return direct;

  const quoted = likeContains(JSON.stringify(slug));
  const candidates = await Model.findAll({
    where: { ...where, previousSlugs: { [Op.like]: quoted } },
    ...rest,
  });
  return candidates.find((row) => row.previousSlugs.includes(slug)) ?? null;
}

// ORDER BY name in byte order (uppercase before lowercase), which is how the
// old Mongo sort ordered strings. `alias` is the model name used in the query.
export function nameByteOrder(alias) {
  return [literal(`\`${alias}\`.\`name\` COLLATE utf8mb4_bin`), "ASC"];
}
