import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize.js";
import { idColumn, legacyIdColumn, mongoIdColumn, text } from "../fields.js";

const BlogCategory = sequelize.define(
  "BlogCategory",
  {
    id: idColumn,
    mongoId: mongoIdColumn,
    title: text("title", { required: true, label: "Category title", max: 255 }),
    slug: {
      ...text("slug", { required: true, label: "Slug", lower: true }),
      unique: true,
    },
    metaTitle: text("metaTitle", { label: "Meta title", max: 70 }),
    metaDescription: text("metaDescription", {
      label: "Meta description",
      max: 255,
    }),
    metaKeywords: text("metaKeywords", { label: "Meta keywords", max: 255 }),
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    legacyId: legacyIdColumn,
  },
  { tableName: "blog_categories" },
);

export default BlogCategory;
