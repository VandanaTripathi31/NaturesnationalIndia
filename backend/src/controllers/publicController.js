import Category from "../models/Category.js";
import Product from "../models/Product.js";

function formatPublicCategory(category) {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    content: category.content ?? "",
    image: category.image ?? null,
    metaTitle: category.metaTitle ?? "",
    metaDescription: category.metaDescription ?? "",
    metaKeywords: category.metaKeywords ?? "",
  };
}

// Normalise whatever image shape a product has into a consistent
// [{ public_id, url }] list. Handles: array of {url}/{secure_url} objects,
// array of plain URL strings, and a single legacy `image` string field. This
// keeps the public API tolerant of how the data was imported/edited so the
// frontend never has to guess.
function normalizeImages(product) {
  const out = [];
  const push = (url, public_id = "") => {
    const u = typeof url === "string" ? url.trim() : "";
    if (u) out.push({ public_id: public_id || "", url: u });
  };

  const raw = product.images;
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === "string") push(item);
      else if (item && typeof item === "object")
        push(item.url ?? item.secure_url, item.public_id);
    }
  }
  // Legacy single-image fallbacks.
  if (out.length === 0) {
    if (typeof product.image === "string") push(product.image);
    else if (product.image && typeof product.image === "object")
      push(product.image.url ?? product.image.secure_url, product.image.public_id);
  }
  return out;
}

function formatPublicProduct(product) {
  const category =
    product.category && typeof product.category === "object"
      ? formatPublicCategory(product.category)
      : null;

  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    overview: product.overview ?? "",
    botanicalName: product.botanicalName ?? "",
    origin: product.origin ?? "",
    extractionMethod: product.extractionMethod ?? "",
    benefits: product.benefits ?? [],
    uses: product.uses ?? [],
    productCode: product.productCode ?? "",
    blendsWith: product.blendsWith ?? "",
    history: product.history ?? "",
    storage: product.storage ?? "",
    precautions: product.precautions ?? "",
    faqs: product.faqs ?? "",
    specifications: product.specifications ?? [],
    featured: product.featured,
    category,
    images: normalizeImages(product),
    metaTitle: product.metaTitle ?? "",
    metaDescription: product.metaDescription ?? "",
    metaKeywords: product.metaKeywords ?? "",
  };
}

export async function getPublicCategories(_req, res) {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .select("name slug description image metaTitle metaDescription metaKeywords");

    return res.status(200).json({
      categories: categories.map(formatPublicCategory),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
}

export async function searchPublicProducts(req, res) {
  try {
    const query = req.query.q?.trim() ?? req.query.search?.trim() ?? "";
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 8, 1),
      20,
    );

    if (query.length < 2) {
      return res.status(200).json({ query, products: [] });
    }

    // Escape any regex metacharacters so a user typing "(" or "*" can't
    // break the query or trigger a costly pattern.
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(safe, "i");

    const [products, categoryMatches] = await Promise.all([
      Product.find({
        isActive: true,
        $or: [{ name: regex }, { slug: regex }, { botanicalName: regex }],
      })
        .populate({
          path: "category",
          match: { isActive: true },
          select: "name slug",
        })
        .sort({ featured: -1, name: 1 })
        .limit(limit)
        .select("name slug botanicalName images featured category"),
      Category.find({
        isActive: true,
        $or: [{ name: regex }, { slug: regex }],
      })
        .sort({ name: 1 })
        .limit(5)
        .select("name slug image"),
    ]);

    const categories = categoryMatches.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      image: c.image?.url ?? null,
    }));

    // Drop products whose category is inactive/removed (populate → null),
    // since those have no valid public URL.
    const results = products
      .filter((product) => product.category)
      .map((product) => ({
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        botanicalName: product.botanicalName ?? "",
        image: normalizeImages(product)[0]?.url ?? null,
        category: {
          name: product.category.name,
          slug: product.category.slug,
        },
      }));

    return res.status(200).json({ query, products: results, categories });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to search products",
      error: error.message,
    });
  }
}

export async function getPublicCategoryBySlug(req, res) {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 12, 1),
      50,
    );
    const search = req.query.search?.trim() ?? "";
    const skip = (page - 1) * limit;

    const category = await Category.findOne({
      isActive: true,
      $or: [{ slug: req.params.slug }, { previousSlugs: req.params.slug }],
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const productFilter = {
      category: category._id,
      isActive: true,
    };

    if (search) {
      // FIX: unlike searchPublicProducts (the header dropdown), this never
      // escaped regex metacharacters. Product names in this catalog
      // routinely contain them (e.g. "Fenugreek Carrier Oil (100ml)") --
      // `new RegExp("(100ml)", "i")` throws a SyntaxError (unmatched
      // group), which the outer try/catch turns into a 500 and the
      // frontend has nothing sensible to show. Escaping makes the
      // in-category sidebar search behave the same as the header search
      // for any query, special characters included.
      const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(safe, "i");
      productFilter.$or = [
        { name: regex },
        { slug: regex },
        { botanicalName: regex },
        { origin: regex },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(productFilter)
        .populate("category", "name slug image")
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(productFilter),
    ]);

    return res.status(200).json({
      category: formatPublicCategory(category),
      products: products.map(formatPublicProduct),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch category",
      error: error.message,
    });
  }
}

export async function getPublicProductBySlug(req, res) {
  try {
    const product = await Product.findOne({
      isActive: true,
      $or: [{ slug: req.params.slug }, { previousSlugs: req.params.slug }],
    }).populate({
      path: "category",
      match: { isActive: true },
      select: "name slug image description metaTitle metaDescription metaKeywords",
    });

    if (!product || !product.category) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      product: formatPublicProduct(product),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
}

export async function getPublicRelatedProducts(req, res) {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const limit = Math.min(Number.parseInt(req.query.limit, 10) || 8, 20);

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    })
      .populate("category", "name slug")
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      products: relatedProducts.map(formatPublicProduct),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch related products",
      error: error.message,
    });
  }
}
