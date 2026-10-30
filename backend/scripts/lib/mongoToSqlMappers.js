// Pure mappers: a lean Mongo document in, a SQL row out. No I/O, so they are
// unit-tested. Each returns { row, missing } where `missing` lists Mongo ids
// of referenced documents that could not be resolved.

const nul = (value) => (value === undefined ? null : value);
const list = (value) => (Array.isArray(value) ? value : []);
const mongoId = (doc) => String(doc._id);
const now = () => new Date();

// Mongo stored images as { public_id, url }; an empty subdocument means "none".
function imageOrNull(image) {
  if (!image || (!image.url && !image.public_id)) return null;
  return image;
}

function timestamps(doc) {
  return {
    createdAt: doc.createdAt ?? now(),
    updatedAt: doc.updatedAt ?? doc.createdAt ?? now(),
  };
}

export function mapCategory(doc) {
  return {
    row: {
      mongoId: mongoId(doc),
      name: doc.name,
      slug: doc.slug,
      description: nul(doc.description),
      content: doc.content ?? "",
      image: imageOrNull(doc.image),
      metaTitle: nul(doc.metaTitle),
      metaDescription: nul(doc.metaDescription),
      metaKeywords: nul(doc.metaKeywords),
      isActive: doc.isActive ?? true,
      legacyId: nul(doc.legacyId),
      previousSlugs: list(doc.previousSlugs),
      ...timestamps(doc),
    },
    missing: [],
  };
}

export function mapProduct(doc, categoryIdByMongoId) {
  const categoryId = categoryIdByMongoId.get(String(doc.category));
  return {
    row: {
      mongoId: mongoId(doc),
      name: doc.name,
      slug: doc.slug,
      description: nul(doc.description),
      botanicalName: nul(doc.botanicalName),
      origin: nul(doc.origin),
      extractionMethod: nul(doc.extractionMethod),
      benefits: list(doc.benefits),
      uses: list(doc.uses),
      featured: doc.featured ?? false,
      categoryId: categoryId ?? null,
      images: list(doc.images).map((i) => ({
        public_id: i?.public_id ?? "",
        url: i?.url ?? "",
      })),
      metaTitle: nul(doc.metaTitle),
      metaDescription: nul(doc.metaDescription),
      metaKeywords: nul(doc.metaKeywords),
      isActive: doc.isActive ?? true,
      productCode: nul(doc.productCode),
      overview: nul(doc.overview),
      blendsWith: nul(doc.blendsWith),
      history: nul(doc.history),
      storage: nul(doc.storage),
      precautions: nul(doc.precautions),
      faqs: nul(doc.faqs),
      specifications: list(doc.specifications).map((s) => ({
        label: s?.label ?? "",
        value: s?.value ?? "",
      })),
      legacyId: nul(doc.legacyId),
      previousSlugs: list(doc.previousSlugs),
      ...timestamps(doc),
    },
    missing: categoryId ? [] : [String(doc.category)],
  };
}

export function mapBlogCategory(doc) {
  return {
    row: {
      mongoId: mongoId(doc),
      title: doc.title,
      slug: doc.slug,
      metaTitle: nul(doc.metaTitle),
      metaDescription: nul(doc.metaDescription),
      metaKeywords: nul(doc.metaKeywords),
      sortOrder: doc.sortOrder ?? 0,
      isActive: doc.isActive ?? true,
      legacyId: nul(doc.legacyId),
      ...timestamps(doc),
    },
    missing: [],
  };
}

// Also returns `categoryIds`: resolved blog category ids in the post's own
// order (stored as the join table `position`).
export function mapBlog(doc, blogCategoryIdByMongoId) {
  const categoryIds = [];
  const missing = [];
  for (const ref of list(doc.categories)) {
    const id = blogCategoryIdByMongoId.get(String(ref));
    if (id) categoryIds.push(id);
    else missing.push(String(ref));
  }
  return {
    row: {
      mongoId: mongoId(doc),
      title: doc.title,
      slug: doc.slug,
      content: doc.content ?? "",
      excerpt: nul(doc.excerpt),
      image: imageOrNull(doc.image),
      author: doc.author ?? "Natures Natural",
      tags: list(doc.tags),
      metaTitle: nul(doc.metaTitle),
      metaDescription: nul(doc.metaDescription),
      metaKeywords: nul(doc.metaKeywords),
      isActive: doc.isActive ?? true,
      publishedAt: nul(doc.publishedAt),
      legacyId: nul(doc.legacyId),
      ...timestamps(doc),
    },
    categoryIds,
    missing,
  };
}

export function mapEnquiry(doc) {
  return {
    row: {
      mongoId: mongoId(doc),
      name: doc.name,
      email: doc.email,
      phone: nul(doc.phone),
      country: nul(doc.country),
      category: nul(doc.category),
      quantity: nul(doc.quantity),
      message: nul(doc.message),
      source: nul(doc.source),
      status: doc.status ?? "new",
      ...timestamps(doc),
    },
    missing: [],
  };
}

// `password` must already be the stored bcrypt hash (fetched with +password).
export function mapAdmin(doc) {
  return {
    row: {
      mongoId: mongoId(doc),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role ?? "admin",
      ...timestamps(doc),
    },
    missing: doc.password ? [] : ["password"],
  };
}
