import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/** Course catalogue (DB-backed; seed data used as fallback / for seeding). */
const courseSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    level: { type: String, default: "All Levels" },
    excerpt: { type: String, required: true },
    description: { type: String, required: true },
    durationWeeks: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    syllabus: { type: [String], default: [] },
    outcomes: { type: [String], default: [] },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
    comingSoon: { type: Boolean, default: false },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type CourseDbDocument = InferSchemaType<typeof courseSchema> & { _id: string };

export const CourseModel: Model<CourseDbDocument> =
  (models.Course as Model<CourseDbDocument>) ??
  model<CourseDbDocument>("Course", courseSchema);
