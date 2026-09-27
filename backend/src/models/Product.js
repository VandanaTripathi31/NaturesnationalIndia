import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [160, "Product name cannot exceed 160 characters"],
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
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    botanicalName: {
      type: String,
      trim: true,
      maxlength: [160, "Botanical name cannot exceed 160 characters"],
    },
    origin: {
      type: String,
      trim: true,
      maxlength: [120, "Origin cannot exceed 120 characters"],
    },
    extractionMethod: {
      type: String,
      trim: true,
      maxlength: [120, "Extraction method cannot exceed 120 characters"],
    },
    benefits: {
      type: [String],
      default: [],
    },
    uses: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
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

    // ── Extended product-detail fields (from Magento) ─────────────────
    productCode: { type: String, trim: true, maxlength: 120 },
    // Long-form "Overview" shown in the product page Overview tab. Kept
    // separate from `description` so the tab doesn't duplicate the short
    // product description (client review).
    overview: { type: String, trim: true },
    blendsWith: { type: String, trim: true },
    history: { type: String, trim: true },
    storage: { type: String, trim: true },
    precautions: { type: String, trim: true },
    faqs: { type: String, trim: true },
    // Free-form "Additional Information" rows (CAS No, Specific Gravity,
    // Flash Point, Refractive Index, Solubility, Shelf Life, Odor, Colour,
    // Appearance, etc.) preserved verbatim as label/value pairs so the
    // product page can render the full spec table without schema churn.
    specifications: [
      {
        _id: false,
        label: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],

    // Original Magento `catalog_product_entity.entity_id`. Set only for
    // records brought in by the MySQL→MongoDB migration so the import can
    // be re-run safely (upsert by legacyId) and rolled back cleanly.
    legacyId: {
      type: Number,
      index: true,
      sparse: true,
      unique: true,
    },

    // Slugs this product was previously served under. Populated by the
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

productSchema.index({ name: "text", slug: "text", botanicalName: "text" });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1, isActive: 1 });

export default mongoose.model("Product", productSchema);
