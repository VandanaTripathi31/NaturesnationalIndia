import { Schema, model, models, Types, type InferSchemaType, type Model } from "mongoose";

/**
 * Enrollment — links a Student (User) to a course they have access to.
 *
 * `courseSlug` references the content-layer course catalogue (not a DB
 * collection in V1). Progress is a 0–100 integer; a course is "completed"
 * when the admin/instructor marks it (which unlocks certificate issuance —
 * Phase 7). Created for B2C after successful payment (Phase 6).
 */
const enrollmentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseSlug: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
      index: true,
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    source: { type: String, enum: ["b2c", "b2b"], default: "b2c" },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// A student can only enrol once per course.
enrollmentSchema.index({ student: 1, courseSlug: 1 }, { unique: true });

export type EnrollmentDocument = InferSchemaType<typeof enrollmentSchema> & {
  _id: Types.ObjectId;
};

export const Enrollment: Model<EnrollmentDocument> =
  (models.Enrollment as Model<EnrollmentDocument>) ??
  model<EnrollmentDocument>("Enrollment", enrollmentSchema);
