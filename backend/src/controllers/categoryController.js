import { Op } from "sequelize";
import { Category, Product } from "../db/models/index.js";
import { createUniqueSlug } from "../utils/slugify.js";
import { isDuplicateKeyError, likeContains, parseId } from "../utils/dbHelpers.js";
import { deleteImage, uploadImageBuffer } from "../../utils/cloudinaryUpload.js";

function formatCategory(category) {
  return {
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    content: category.content ?? "",
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
  const where = {};

  if (search) {
    const like = { [Op.like]: likeContains(search.trim()) };
    where[Op.or] = [
      { name: like },
      { slug: like },
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

  return where;
}

async function findCategory(rawId) {
  const id = parseId(rawId);
  return id ? Category.findByPk(id) : null;
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

    const where = buildSearchFilter(search, status);

    const { rows: categories, count: total } = await Category.findAndCountAll({
      where,
      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],
      offset: skip,
      limit,
    });

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
    const category = await findCategory(req.params.id);

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
      content = "",
      metaTitle = "",
      metaDescription = "",
      metaKeywords = "",
      isActive = true,
    } = req.body;

    const slug = await createUniqueSlug(Category, name);
    let image = null;

    if (req.file) {
      image = await uploadImageBuffer(req.file.buffer);
    }

    try {
      const category = await Category.create({
        name: name.trim(),
        slug,
        description: description?.trim(),
        content: content ?? "",
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
    if (isDuplicateKeyError(error)) {
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
    const category = await findCategory(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const {
      name,
      description,
      content,
      metaTitle,
      metaDescription,
      metaKeywords,
      isActive,
    } = req.body;

    if (name !== undefined) {
      category.name = name.trim();
      category.slug = await createUniqueSlug(Category, name, category.id);
    }

    if (description !== undefined) category.description = description.trim();
    if (content !== undefined) category.content = content;
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
    if (isDuplicateKeyError(error)) {
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
    const category = await findCategory(req.params.id);

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
    const category = await findCategory(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Products reference categories; deleting one that is still in use would
    // leave products with no public URL (and the foreign key forbids it).
    if (await Product.count({ where: { categoryId: category.id } })) {
      return res.status(409).json({
        message: "Category has products and cannot be deleted",
      });
    }

    if (category.image?.public_id) {
      await deleteImage(category.image.public_id);
    }

    await category.destroy();

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
