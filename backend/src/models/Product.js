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
  },
  {
    timestamps: true,
  },
);

productSchema.index({ name: "text", slug: "text", botanicalName: "text" });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1, isActive: 1 });

export default mongoose.model("Product", productSchema);
