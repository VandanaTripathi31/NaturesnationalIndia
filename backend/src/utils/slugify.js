import { Op } from "sequelize";

export function generateSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createUniqueSlug(Model, name, excludeId = null) {
  const baseSlug = generateSlug(name);

  if (!baseSlug) {
    throw new Error("Unable to generate slug from category name");
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const where = { slug };

    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const existing = await Model.findOne({ where, attributes: ["id"] });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}
