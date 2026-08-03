import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const blogPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String, required: true },
    readingMinutes: { type: Number, default: 4 },
    publishedAt: { type: Date, default: Date.now },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type BlogPostDbDocument = InferSchemaType<typeof blogPostSchema> & { _id: string };

export const BlogPostModel: Model<BlogPostDbDocument> =
  (models.BlogPost as Model<BlogPostDbDocument>) ??
  model<BlogPostDbDocument>("BlogPost", blogPostSchema);
