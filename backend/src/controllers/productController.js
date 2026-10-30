import { Op } from "sequelize";
import { Category, Product } from "../db/models/index.js";
import { createUniqueSlug } from "../utils/slugify.js";
import { isDuplicateKeyError, likeContains, parseId } from "../utils/dbHelpers.js";
import {
  deleteImages,
  uploadMultipleImageBuffers,
} from "../../utils/cloudinaryUpload.js";

function formatCategoryRef(category) {
  if (!category) return null;

  return {
    id: String(category.id),
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
    // `public_id` is only present for images uploaded/re-hosted through
    // Cloudinary. Products brought in by the default (IMAGE_MODE=reference)
    // migration store a valid `url` pointing at the legacy media host with
    // an intentionally empty `public_id` (see migration/lib/images.js). The
    // old `image.public_id && image.url` check dropped every one of those
    // — i.e. every migrated product's image — leaving `images: []` in the
    // API response and forcing the frontend to fall back to the
    // no-image/no_selection placeholder. A usable image only requires a
    // non-empty `url`; `public_id` is optional metadata used for
    // Cloudinary asset management (deletion, etc.), not for display.
    .filter((image) => image.url);
}

function formatProduct(product) {
  const category =
    product.category && typeof product.category === "object"
      ? formatCategoryRef(product.category)
      : product.category
        ? { id: String(product.category) }
        : null;

  return {
    id: String(product.id),
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

// Includes the category the way every admin response expects it.
const categoryInclude = (attributes) => ({
  model: Category,
  as: "category",
  attributes,
});
const ADMIN_CATEGORY_ATTRS = ["id", "name", "slug", "image", "isActive"];

function findProduct(rawId, options = {}) {
  const id = parseId(rawId);
  return id ? Product.findByPk(id, options) : null;
}

function buildSearchFilter(search, status, categoryId) {
  const where = {};

  if (search) {
    const like = { [Op.like]: likeContains(search.trim()) };
    where[Op.or] = [
      { name: like },
      { slug: like },
      { botanicalName: like },
      { origin: like },
      { metaTitle: like },
      { metaDescription: like },
      { metaKeywords: like },
    ];
  }

  if (status === "active") {
    where.isActive = true;
  } else if (status === "inactive") {
    where.isActive = false;
  }

  // An unparseable category filter is ignored, as before.
  const parsedCategoryId = parseId(categoryId);
  if (parsedCategoryId) {
    where.categoryId = parsedCategoryId;
  }

  return where;
}

async function ensureCategoryExists(rawCategoryId) {
  const id = parseId(rawCategoryId);
  const category = id ? await Category.findByPk(id) : null;

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

    const where = buildSearchFilter(search, status, categoryId);

    const [products, total] = await Promise.all([
      Product.findAll({
        where,
        include: [categoryInclude(ADMIN_CATEGORY_ATTRS)],
        order: [
          ["createdAt", "DESC"],
          ["id", "DESC"],
        ],
        offset: skip,
        limit,
      }),
      Product.count({ where }),
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
    const product = await findProduct(req.params.id, {
      include: [categoryInclude(ADMIN_CATEGORY_ATTRS)],
    });

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
    const product = await findProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const limit = Math.min(Number.parseInt(req.query.limit, 10) || 8, 20);

    const relatedProducts = await Product.findAll({
      where: {
        id: { [Op.ne]: product.id },
        categoryId: product.categoryId,
        isActive: true,
      },
      include: [categoryInclude(["id", "name", "slug"])],
      order: [
        ["featured", "DESC"],
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],
      limit,
    });

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
      categoryId: parseId(category),
      images: uploadedImages,
      metaTitle: metaTitle?.trim(),
      metaDescription: metaDescription?.trim(),
      metaKeywords: metaKeywords?.trim(),
      isActive,
    });

    const populated = await Product.findByPk(product.id, {
      include: [categoryInclude(ADMIN_CATEGORY_ATTRS)],
    });

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

    if (isDuplicateKeyError(error)) {
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
    const product = await findProduct(req.params.id);

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
      product.categoryId = parseId(category);
    }

    if (name !== undefined) {
      product.name = name.trim();
      product.slug = await createUniqueSlug(Product, name, product.id);
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

    const populated = await Product.findByPk(product.id, {
      include: [categoryInclude(ADMIN_CATEGORY_ATTRS)],
    });

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

    if (isDuplicateKeyError(error)) {
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
    const product = await findProduct(req.params.id, {
      include: [categoryInclude(ADMIN_CATEGORY_ATTRS)],
    });

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
    const product = await findProduct(req.params.id, {
      include: [categoryInclude(ADMIN_CATEGORY_ATTRS)],
    });

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
    const product = await findProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images?.length) {
      await deleteImages(product.images.map((image) => image.public_id));
    }

    await product.destroy();

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
