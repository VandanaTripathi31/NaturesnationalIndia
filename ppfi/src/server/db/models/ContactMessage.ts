import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    handled: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export type ContactMessageDocument = InferSchemaType<typeof contactMessageSchema> & {
  _id: string;
};

export const ContactMessage: Model<ContactMessageDocument> =
  (models.ContactMessage as Model<ContactMessageDocument>) ??
  model<ContactMessageDocument>("ContactMessage", contactMessageSchema);
