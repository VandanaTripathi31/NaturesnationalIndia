import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Batch — a group of students (Handover Doc §4.3). Used for both B2C cohorts
 * and B2B on-campus groups. A B2B batch links to an Organization.
 */
const batchSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    courseSlug: { type: String, required: true },
    type: { type: String, enum: ["b2c", "b2b"], default: "b2c", index: true },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
      index: true,
    },
    mentorSlug: { type: String, default: "" },
    capacity: { type: Number, default: 0 },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["upcoming", "running", "completed"],
      default: "upcoming",
      index: true,
    },
  },
  { timestamps: true },
);

export type BatchDocument = InferSchemaType<typeof batchSchema> & { _id: string };

export const Batch: Model<BatchDocument> =
  (models.Batch as Model<BatchDocument>) ?? model<BatchDocument>("Batch", batchSchema);
