import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Organization — a partnered school/college (Handover Doc §4.3). Admin-managed
 * only in V1; created when an Admin converts a B2B Inquiry into a partnership.
 */
const organizationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "paused", "ended"],
      default: "active",
      index: true,
    },
    notes: { type: String, default: "" },
    /** The inquiry this org was converted from, if any. */
    sourceInquiry: { type: Schema.Types.ObjectId, ref: "Inquiry", default: null },
  },
  { timestamps: true },
);

export type OrganizationDocument = InferSchemaType<typeof organizationSchema> & {
  _id: string;
};

export const Organization: Model<OrganizationDocument> =
  (models.Organization as Model<OrganizationDocument>) ??
  model<OrganizationDocument>("Organization", organizationSchema);
