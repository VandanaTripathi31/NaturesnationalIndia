import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 40,
    },
    country: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    category: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    quantity: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    // Where the enquiry was submitted from (product slug, page path, etc.).
    source: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    status: {
      type: String,
      enum: ["new", "read", "responded", "archived"],
      default: "new",
    },
  },
  {
    timestamps: true,
  },
);

enquirySchema.index({ createdAt: -1 });

export default mongoose.model("Enquiry", enquirySchema);
