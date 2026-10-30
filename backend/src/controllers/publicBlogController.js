import { Op } from "sequelize";
import {
  Blog,
  BlogBlogCategory,
  BlogCategory,
} from "../db/models/index.js";
import { likeContains } from "../utils/dbHelpers.js";

// Kept in its own controller (rather than folded into publicController.js)
// so the blog feature stays a self-contained addition — nothing here
// touches Product/Category code paths.

const SUMMARY_ATTRIBUTES = [
  "id",
  "title",
  "slug",
  "excerpt",
  "image",
  "author",
  "tags",
  "publishedAt",
  "createdAt",
];

const categoriesInclude = {
  model: BlogCategory,
  as: "categories",
  attributes: ["id", "title", "slug"],
  through: { attributes: ["position"] },
  required: false,
};

const NEWEST_FIRST = [
  ["publishedAt", "DESC"],
  ["createdAt", "DESC"],
  ["id", "DESC"],
];

// A blog keeps its categories in the order they were assigned.
function orderedCategories(blog) {
  return [...(blog.categories ?? [])].sort(
    (a, b) =>
      (a.BlogBlogCategory?.position ?? 0) - (b.BlogBlogCategory?.position ?? 0) ||
      a.id - b.id,
  );
}

// `tags` is a JSON array in a text column: match the quoted element.
const hasTag = (tag) => ({ [Op.like]: likeContains(JSON.stringify(tag)) });

function formatBlogCategory(category) {
  if (!category) return null;
  return {
    id: String(category.id),
    title: category.title,
    slug: category.slug,
  };
}

function formatBlogSummary(blog) {
  return {
    id: String(blog.id),
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt ?? "",
    image: blog.image?.url ?? null,
    author: blog.author ?? "",
    categories: orderedCategories(blog).map(formatBlogCategory).filter(Boolean),
    tags: blog.tags ?? [],
    publishedAt: blog.publishedAt,
  };
}

function formatBlogDetail(blog) {
  return {
    ...formatBlogSummary(blog),
    content: blog.content ?? "",
    metaTitle: blog.metaTitle || blog.title,
    metaDescription: blog.metaDescription || blog.excerpt || "",
    metaKeywords: blog.metaKeywords ?? "",
  };
}

async function blogIdsInCategories(categoryIds) {
  if (!categoryIds.length) return [];
  const rows = await BlogBlogCategory.findAll({
    where: { blogCategoryId: { [Op.in]: categoryIds } },
    attributes: ["blogId"],
  });
  return rows.map((row) => row.blogId);
}

export async function getPublicBlogs(req, res) {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      50,
    );
    const search = req.query.search?.trim() ?? "";
    const categorySlug = req.query.category?.trim() ?? "";
    const tag = req.query.tag?.trim() ?? "";
    const skip = (page - 1) * limit;

    const where = { isActive: true };
    const and = [];

    if (search) {
      const like = { [Op.like]: likeContains(search) };
      and.push({ [Op.or]: [{ title: like }, { excerpt: like }, { tags: like }] });
    }

    if (tag) {
      and.push({ tags: hasTag(tag) });
    }

    if (categorySlug) {
      const category = await BlogCategory.findOne({
        where: { slug: categorySlug, isActive: true },
        attributes: ["id"],
      });
      if (!category) {
        return res.status(200).json({
          blogs: [],
          pagination: { page, limit, total: 0, pages: 0 },
        });
      }
      and.push({ id: { [Op.in]: await blogIdsInCategories([category.id]) } });
    }

    if (and.length) where[Op.and] = and;

    const [blogs, total] = await Promise.all([
      Blog.findAll({
        where,
        attributes: SUMMARY_ATTRIBUTES,
        include: [categoriesInclude],
        order: NEWEST_FIRST,
        offset: skip,
        limit,
      }),
      Blog.count({ where }),
    ]);

    return res.status(200).json({
      blogs: blogs.map(formatBlogSummary),
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
}

export async function getPublicBlogBySlug(req, res) {
  try {
    const blog = await Blog.findOne({
      where: { slug: req.params.slug, isActive: true },
      include: [categoriesInclude],
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ blog: formatBlogDetail(blog) });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
}

export async function getPublicRelatedBlogs(req, res) {
  try {
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 3, 1),
      10,
    );

    const blog = await Blog.findOne({
      where: { slug: req.params.slug, isActive: true },
      include: [{ ...categoriesInclude, attributes: ["id"] }],
    });

    if (!blog) {
      return res.status(200).json({ blogs: [] });
    }

    const sharedCategoryBlogIds = await blogIdsInCategories(
      (blog.categories ?? []).map((c) => c.id),
    );
    const matches = [
      ...(sharedCategoryBlogIds.length
        ? [{ id: { [Op.in]: sharedCategoryBlogIds } }]
        : []),
      ...blog.tags.map((tag) => ({ tags: hasTag(tag) })),
    ];

    if (!matches.length) {
      return res.status(200).json({ blogs: [] });
    }

    const related = await Blog.findAll({
      where: {
        id: { [Op.ne]: blog.id },
        isActive: true,
        [Op.or]: matches,
      },
      attributes: SUMMARY_ATTRIBUTES,
      include: [categoriesInclude],
      order: [
        ["publishedAt", "DESC"],
        ["id", "DESC"],
      ],
      limit,
    });

    return res.status(200).json({ blogs: related.map(formatBlogSummary) });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch related blogs",
      error: error.message,
    });
  }
}
