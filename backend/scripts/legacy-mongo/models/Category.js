import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: [120, "Category name cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    // Long-form, per-category SEO content shown below the product listing
    // (Introduction, Uses, Applications, FAQ, …). Stored as HTML authored in
    // the Admin Dashboard so every category can have its own content without
    // code changes. Rendered by the frontend CategoryPageView.
    content: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      public_id: String,
      url: String,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, "Meta title cannot exceed 70 characters"],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    metaKeywords: {
      type: String,
      trim: true,
      maxlength: [255, "Meta keywords cannot exceed 255 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Original Magento `catalog_category_entity.entity_id`. Set only for
    // records brought in by the MySQL→MongoDB migration so the import can
    // be re-run safely (upsert by legacyId) and rolled back cleanly.
    legacyId: {
      type: Number,
      index: true,
      sparse: true,
      unique: true,
    },

    // Slugs this category was previously served under. Populated by the
    // slug-alignment migration so old (already-indexed) URLs can 301-redirect
    // to the current canonical slug instead of 404ing.
    previousSlugs: {
      type: [String],
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({ name: "text", slug: "text", metaTitle: "text" });

export default mongoose.model("Category", categorySchema);
