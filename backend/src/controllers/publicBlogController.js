import Blog from "../models/Blog.js";
import BlogCategory from "../models/BlogCategory.js";

// Kept in its own controller (rather than folded into publicController.js)
// so the blog feature stays a self-contained addition — nothing here
// touches Product/Category code paths.

function formatBlogCategory(category) {
  if (!category) return null;
  return {
    id: category._id.toString(),
    title: category.title,
    slug: category.slug,
  };
}

function formatBlogSummary(blog) {
  return {
    id: blog._id.toString(),
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt ?? "",
    image: blog.image?.url ?? null,
    author: blog.author ?? "",
    categories: (blog.categories ?? [])
      .map(formatBlogCategory)
      .filter(Boolean),
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

    const filter = { isActive: true };

    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(safe, "i");
      filter.$or = [{ title: regex }, { excerpt: regex }, { tags: regex }];
    }

    if (tag) {
      filter.tags = tag;
    }

    if (categorySlug) {
      const category = await BlogCategory.findOne({
        slug: categorySlug,
        isActive: true,
      }).select("_id");
      if (!category) {
        return res.status(200).json({
          blogs: [],
          pagination: { page, limit, total: 0, pages: 0 },
        });
      }
      filter.categories = category._id;
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate({ path: "categories", select: "title slug" })
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("title slug excerpt image author categories tags publishedAt"),
      Blog.countDocuments(filter),
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
      slug: req.params.slug,
      isActive: true,
    }).populate({ path: "categories", select: "title slug" });

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
      slug: req.params.slug,
      isActive: true,
    }).select("categories tags");

    if (!blog) {
      return res.status(200).json({ blogs: [] });
    }

    const related = await Blog.find({
      _id: { $ne: blog._id },
      isActive: true,
      $or: [
        { categories: { $in: blog.categories } },
        { tags: { $in: blog.tags } },
      ],
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select("title slug excerpt image author categories tags publishedAt");

    return res.status(200).json({ blogs: related.map(formatBlogSummary) });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch related blogs",
      error: error.message,
    });
  }
}
