import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize.js";
import {
  idColumn,
  jsonField,
  legacyIdColumn,
  mongoIdColumn,
  text,
  timestampColumns,
} from "../fields.js";

const Blog = sequelize.define(
  "Blog",
  {
    id: idColumn,
    mongoId: mongoIdColumn,
    title: text("title", { required: true, label: "Blog title", max: 255 }),
    // Case-preserving on purpose (legacy identifiers); the column is utf8mb4_bin.
    slug: { ...text("slug", { required: true, label: "Slug" }), unique: true },
    content: { ...text("content", { long: true, trim: false }), defaultValue: "" },
    excerpt: text("excerpt", { label: "Excerpt", max: 500, long: true }),
    image: jsonField("image", () => null),
    author: { ...text("author"), defaultValue: "Natures Natural" },
    tags: jsonField("tags", () => []),
    metaTitle: text("metaTitle", { label: "Meta title", max: 70 }),
    metaDescription: text("metaDescription", {
      label: "Meta description",
      max: 255,
    }),
    metaKeywords: text("metaKeywords", { label: "Meta keywords", max: 255 }),
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    publishedAt: { type: DataTypes.DATE(3), allowNull: true },
    legacyId: legacyIdColumn,
    ...timestampColumns,
  },
  { tableName: "blogs" },
);

export default Blog;
