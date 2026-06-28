import Category from "../models/Category.js";
import Product from "../models/Product.js";

function formatPublicCategory(category) {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    image: category.image ?? null,
    metaTitle: category.metaTitle ?? "",
    metaDescription: category.metaDescription ?? "",
    metaKeywords: category.metaKeywords ?? "",
  };
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
    botanicalName: product.botanicalName ?? "",
    origin: product.origin ?? "",
    extractionMethod: product.extractionMethod ?? "",
    benefits: product.benefits ?? [],
    uses: product.uses ?? [],
    featured: product.featured,
    category,
    images: product.images ?? [],
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
      slug: req.params.slug,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const productFilter = {
      category: category._id,
      isActive: true,
    };

    if (search) {
      const regex = new RegExp(search.trim(), "i");
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
      slug: req.params.slug,
      isActive: true,
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
