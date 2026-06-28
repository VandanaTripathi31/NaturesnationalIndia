import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { createUniqueSlug } from "../utils/slugify.js";
import {
  deleteImages,
  uploadMultipleImageBuffers,
} from "../../utils/cloudinaryUpload.js";

function formatCategoryRef(category) {
  if (!category) return null;

  return {
    id: category._id?.toString?.() ?? category.id,
    name: category.name,
    slug: category.slug,
    image: category.image ?? null,
  };
}

function normalizeImages(images = []) {
  return images
    .map((image) => ({
      public_id: image?.public_id ?? "",
      url: image?.url ?? image?.secure_url ?? "",
    }))
    .filter((image) => image.public_id && image.url);
}

function formatProduct(product) {
  const category =
    product.category && typeof product.category === "object"
      ? formatCategoryRef(product.category)
      : product.category
        ? { id: product.category.toString() }
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
    images: normalizeImages(product.images),
    metaTitle: product.metaTitle ?? "",
    metaDescription: product.metaDescription ?? "",
    metaKeywords: product.metaKeywords ?? "",
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function buildSearchFilter(search, status, categoryId) {
  const filter = {};

  if (search) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [
      { name: regex },
      { slug: regex },
      { botanicalName: regex },
      { origin: regex },
      { metaTitle: regex },
      { metaDescription: regex },
      { metaKeywords: regex },
    ];
  }

  if (status === "active") {
    filter.isActive = true;
  } else if (status === "inactive") {
    filter.isActive = false;
  }

  if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    filter.category = categoryId;
  }

  return filter;
}

async function ensureCategoryExists(categoryId) {
  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
}

async function uploadProductImagesFromRequest(req) {
  if (!req.files?.length) {
    return [];
  }

  const buffers = req.files
    .map((file) => file.buffer)
    .filter((buffer) => Buffer.isBuffer(buffer) && buffer.length > 0);

  console.log("[Product Upload] files received:", req.files.length);
  console.log("[Product Upload] valid buffers:", buffers.length);

  if (!buffers.length) {
    throw new Error("Uploaded image files are empty or invalid");
  }

  return uploadMultipleImageBuffers(buffers, "natures-national/products");
}

function applyRemovedImages(product, removedImageIds = []) {
  if (!removedImageIds.length) {
    return [];
  }

  const removedSet = new Set(removedImageIds);
  const imagesToDelete = product.images
    .filter((image) => removedSet.has(image.public_id))
    .map((image) => image.public_id);

  product.images = product.images.filter(
    (image) => !removedSet.has(image.public_id),
  );

  return imagesToDelete;
}

export async function getProducts(req, res) {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      50,
    );
    const search = req.query.search?.trim() ?? "";
    const status = req.query.status ?? "all";
    const categoryId = req.query.category ?? "";
    const skip = (page - 1) * limit;

    const filter = buildSearchFilter(search, status, categoryId);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug image isActive")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      products: products.map(formatProduct),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug image isActive",
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product: formatProduct(product) });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
}

export async function getRelatedProducts(req, res) {
  try {
    const product = await Product.findById(req.params.id);

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
      products: relatedProducts.map(formatProduct),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch related products",
      error: error.message,
    });
  }
}

export async function createProduct(req, res) {
  let uploadedImages = [];

  try {
    await ensureCategoryExists(req.body.category);

    const {
      name,
      description = "",
      botanicalName = "",
      origin = "",
      extractionMethod = "",
      benefits = [],
      uses = [],
      featured = false,
      category,
      metaTitle = "",
      metaDescription = "",
      metaKeywords = "",
      isActive = true,
    } = req.body;

    const slug = await createUniqueSlug(Product, name);
    uploadedImages = await uploadProductImagesFromRequest(req);

    const product = await Product.create({
      name: name.trim(),
      slug,
      description: description?.trim(),
      botanicalName: botanicalName?.trim(),
      origin: origin?.trim(),
      extractionMethod: extractionMethod?.trim(),
      benefits,
      uses,
      featured,
      category,
      images: uploadedImages,
      metaTitle: metaTitle?.trim(),
      metaDescription: metaDescription?.trim(),
      metaKeywords: metaKeywords?.trim(),
      isActive,
    });

    const populated = await Product.findById(product._id).populate(
      "category",
      "name slug image isActive",
    );

    return res.status(201).json({
      message: "Product created successfully",
      product: formatProduct(populated),
    });
  } catch (error) {
    if (uploadedImages.length) {
      await deleteImages(uploadedImages.map((image) => image.public_id));
    }

    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "A product with this name or slug already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
}

export async function updateProduct(req, res) {
  let uploadedImages = [];

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      description,
      botanicalName,
      origin,
      extractionMethod,
      benefits,
      uses,
      featured,
      category,
      metaTitle,
      metaDescription,
      metaKeywords,
      isActive,
      removedImageIds = [],
    } = req.body;

    if (category !== undefined) {
      await ensureCategoryExists(category);
      product.category = category;
    }

    if (name !== undefined) {
      product.name = name.trim();
      product.slug = await createUniqueSlug(Product, name, product._id);
    }

    if (description !== undefined) product.description = description.trim();
    if (botanicalName !== undefined) product.botanicalName = botanicalName.trim();
    if (origin !== undefined) product.origin = origin.trim();
    if (extractionMethod !== undefined) {
      product.extractionMethod = extractionMethod.trim();
    }
    if (benefits !== undefined) product.benefits = benefits;
    if (uses !== undefined) product.uses = uses;
    if (featured !== undefined) product.featured = featured;
    if (metaTitle !== undefined) product.metaTitle = metaTitle.trim();
    if (metaDescription !== undefined) {
      product.metaDescription = metaDescription.trim();
    }
    if (metaKeywords !== undefined) product.metaKeywords = metaKeywords.trim();
    if (isActive !== undefined) product.isActive = isActive;

    const imagesToDelete = applyRemovedImages(product, removedImageIds);
    uploadedImages = await uploadProductImagesFromRequest(req);

    if (uploadedImages.length) {
      product.images = [...product.images, ...uploadedImages];
    }

    await product.save();

    if (imagesToDelete.length) {
      await deleteImages(imagesToDelete);
    }

    const populated = await Product.findById(product._id).populate(
      "category",
      "name slug image isActive",
    );

    return res.status(200).json({
      message: "Product updated successfully",
      product: formatProduct(populated),
    });
  } catch (error) {
    if (uploadedImages.length) {
      await deleteImages(uploadedImages.map((image) => image.public_id));
    }

    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "A product with this name or slug already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
}

export async function toggleProductStatus(req, res) {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug image isActive",
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isActive = req.body.isActive;
    await product.save();

    return res.status(200).json({
      message: `Product marked as ${product.isActive ? "active" : "inactive"}`,
      product: formatProduct(product),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update product status",
      error: error.message,
    });
  }
}

export async function toggleProductFeatured(req, res) {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug image isActive",
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.featured = req.body.featured;
    await product.save();

    return res.status(200).json({
      message: `Product ${product.featured ? "marked as featured" : "removed from featured"}`,
      product: formatProduct(product),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update featured status",
      error: error.message,
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images?.length) {
      await deleteImages(product.images.map((image) => image.public_id));
    }

    await product.deleteOne();

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
}
