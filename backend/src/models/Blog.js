import mongoose from "mongoose";

// Mirrors Magento's `aw_blog` table (the aheadWorks Blog extension), plus
// the category/tag relations from `aw_blog_post_cat` / the post's own
// `tags` column, resolved at migration time.
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [255, "Blog title cannot exceed 255 characters"],
    },
    // Magento's `identifier` column — the URL segment the post has always
    // been served under (`/blog/{identifier}/`). Preserved verbatim
    // (case included — some legacy identifiers are mixed-case) so existing
    // indexed/shared blog links keep working; deliberately NOT lowercased
    // the way Product/Category slugs are.
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Full HTML article body (`post_content`). Rendered with the same
    // trusted-HTML pattern the site already uses for category `content`
    // (CategoryContent.jsx) — sanitized once at migration time, not on
    // every render.
    content: {
      type: String,
      default: "",
    },
    // `short_content` — Magento's manually-authored teaser. Falls back to
    // an auto-generated excerpt of `content` at migration time when blank.
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    // First `<img src="...">` found in `post_content`, if any — the old
    // theme had no dedicated featured-image field, images were embedded
    // directly in the article body.
    image: {
      public_id: String,
      url: String,
    },
    author: {
      type: String,
      trim: true,
      default: "Natures Natural",
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogCategory",
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, "Meta title cannot exceed 70 characters"],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [255, "Meta description cannot exceed 255 characters"],
    },
    metaKeywords: {
      type: String,
      trim: true,
      maxlength: [255, "Meta keywords cannot exceed 255 characters"],
    },
    // Magento `status`: 1 = enabled/published, 0 = disabled/draft. Only
    // published posts are ever returned by the public API.
    isActive: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
    },
    // Original `aw_blog.post_id`. Set only for records brought in by the
    // SQL→MongoDB blog migration so it can be re-run safely (upsert by
    // legacyId) without creating duplicates.
    legacyId: {
      type: Number,
      index: true,
      sparse: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

blogSchema.index({ title: "text", slug: "text", tags: "text" });
blogSchema.index({ isActive: 1, publishedAt: -1 });

export default mongoose.model("Blog", blogSchema);
