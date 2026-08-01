import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * B2B partnership inquiry (Handover Document §3.2, §4.4). Institute reps have
 * no login in V1 — this is a structured form submission the Admin acts on.
 */
const inquirySchema = new Schema(
  {
    instituteName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    studentStrength: { type: Number, required: true, min: 1 },
    interestAreas: { type: [String], default: [] },
    timeSlots: { type: String, trim: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

export type InquiryDocument = InferSchemaType<typeof inquirySchema> & { _id: string };

export const Inquiry: Model<InquiryDocument> =
  (models.Inquiry as Model<InquiryDocument>) ??
  model<InquiryDocument>("Inquiry", inquirySchema);
