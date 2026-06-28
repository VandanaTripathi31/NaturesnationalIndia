import Category from "../models/Category.js";
import { createUniqueSlug } from "../utils/slugify.js";
import { deleteImage, uploadImageBuffer } from "../../utils/cloudinaryUpload.js";

function formatCategory(category) {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    image: category.image ?? null,
    metaTitle: category.metaTitle ?? "",
    metaDescription: category.metaDescription ?? "",
    metaKeywords: category.metaKeywords ?? "",
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

function buildSearchFilter(search, status) {
  const filter = {};

  if (search) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [
      { name: regex },
      { slug: regex },
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

  return filter;
}

export async function getCategories(req, res) {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      50,
    );
    const search = req.query.search?.trim() ?? "";
    const status = req.query.status ?? "all";
    const skip = (page - 1) * limit;

    const filter = buildSearchFilter(search, status);

    const [categories, total] = await Promise.all([
      Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Category.countDocuments(filter),
    ]);

    return res.status(200).json({
      categories: categories.map(formatCategory),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
}

export async function getCategoryById(req, res) {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ category: formatCategory(category) });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch category",
      error: error.message,
    });
  }
}

export async function createCategory(req, res) {
  try {
    const {
      name,
      description = "",
      metaTitle = "",
      metaDescription = "",
      metaKeywords = "",
      isActive = true,
    } = req.body;

    console.log("Creating category:", { name, hasFile: !!req.file });

    const slug = await createUniqueSlug(Category, name);
    let image = null;

    if (req.file) {
      console.log("Uploading image, size:", req.file.size, "bytes");
      image = await uploadImageBuffer(req.file.buffer);
      console.log("Image uploaded:", image);
    }

    try {
      const category = await Category.create({
        name: name.trim(),
        slug,
        description: description?.trim(),
        metaTitle: metaTitle?.trim(),
        metaDescription: metaDescription?.trim(),
        metaKeywords: metaKeywords?.trim(),
        isActive,
        image,
      });

      return res.status(201).json({
        message: "Category created successfully",
        category: formatCategory(category),
      });
    } catch (createError) {
      if (image?.public_id) {
        await deleteImage(image.public_id);
      }
      throw createError;
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A category with this name or slug already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
}

export async function updateCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const {
      name,
      description,
      metaTitle,
      metaDescription,
      metaKeywords,
      isActive,
    } = req.body;

    if (name !== undefined) {
      category.name = name.trim();
      category.slug = await createUniqueSlug(Category, name, category._id);
    }

    if (description !== undefined) category.description = description.trim();
    if (metaTitle !== undefined) category.metaTitle = metaTitle.trim();
    if (metaDescription !== undefined) {
      category.metaDescription = metaDescription.trim();
    }
    if (metaKeywords !== undefined) category.metaKeywords = metaKeywords.trim();
    if (isActive !== undefined) category.isActive = isActive;

    if (req.file) {
      if (category.image?.public_id) {
        await deleteImage(category.image.public_id);
      }

      category.image = await uploadImageBuffer(req.file.buffer);
    }

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      category: formatCategory(category),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A category with this name or slug already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
}

export async function toggleCategoryStatus(req, res) {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.isActive = req.body.isActive;
    await category.save();

    return res.status(200).json({
      message: `Category marked as ${category.isActive ? "active" : "inactive"}`,
      category: formatCategory(category),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update category status",
      error: error.message,
    });
  }
}

export async function deleteCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.image?.public_id) {
      await deleteImage(category.image.public_id);
    }

    await category.deleteOne();

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
}
