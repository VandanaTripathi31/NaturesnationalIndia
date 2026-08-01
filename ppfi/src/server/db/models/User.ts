import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

import { ALL_ROLES, ROLES } from "@/config/roles";

/**
 * User — an authenticated account. V1 supports two roles: STUDENT (B2C
 * learners) and ADMIN (PPFI internal team). See Handover Document §4.
 */
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Not selected by default so it never leaks through generic queries.
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ALL_ROLES,
      default: ROLES.STUDENT,
      required: true,
    },
    image: { type: String },
    phone: { type: String, trim: true },
    emailVerified: { type: Date, default: null },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: string };

export const User: Model<UserDocument> =
  (models.User as Model<UserDocument>) ?? model<UserDocument>("User", userSchema);
