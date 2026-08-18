import mongoose from "mongoose";

// Mirrors Magento's `aw_blog_cat` table (the aheadWorks Blog extension).
const blogCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Category title is required"],
      trim: true,
      maxlength: [255, "Category title cannot exceed 255 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Original `aw_blog_cat.cat_id`. Set only for records brought in by the
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

export default mongoose.model("BlogCategory", blogCategorySchema);
