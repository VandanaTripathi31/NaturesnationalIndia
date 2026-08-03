import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const mentorSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    expertise: { type: [String], default: [] },
    bio: { type: String, required: true },
    image: { type: String, required: true },
    linkedin: { type: String, default: "" },
    instagram: { type: String, default: "" },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type MentorDbDocument = InferSchemaType<typeof mentorSchema> & { _id: string };

export const MentorModel: Model<MentorDbDocument> =
  (models.Mentor as Model<MentorDbDocument>) ??
  model<MentorDbDocument>("Mentor", mentorSchema);
