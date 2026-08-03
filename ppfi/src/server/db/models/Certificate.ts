import { Schema, model, models, Types, type InferSchemaType, type Model } from "mongoose";

/**
 * Certificate — issued on course completion (Handover Doc §6, Rule 3).
 *
 * `certificateId` is the public, verifiable identifier used by the Phase 7
 * verification page. B2B certificates are co-branded with the partner
 * institute's name (`organizationName`).
 */
const certificateSchema = new Schema(
  {
    certificateId: { type: String, required: true, unique: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    studentName: { type: String, required: true },
    courseSlug: { type: String, required: true },
    courseTitle: { type: String, required: true },
    type: { type: String, enum: ["b2c", "b2b"], default: "b2c" },
    organizationName: { type: String, default: null },
    issuedAt: { type: Date, default: Date.now },
    revoked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type CertificateDocument = InferSchemaType<typeof certificateSchema> & {
  _id: Types.ObjectId;
};

export const Certificate: Model<CertificateDocument> =
  (models.Certificate as Model<CertificateDocument>) ??
  model<CertificateDocument>("Certificate", certificateSchema);
