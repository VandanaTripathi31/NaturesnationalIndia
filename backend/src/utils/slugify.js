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
    const query = { slug };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Model.findOne(query).select("_id");

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}
