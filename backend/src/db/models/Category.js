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

const Category = sequelize.define(
  "Category",
  {
    id: idColumn,
    mongoId: mongoIdColumn,
    name: {
      ...text("name", { required: true, label: "Category name", max: 120 }),
      unique: true,
    },
    slug: {
      ...text("slug", { required: true, label: "Slug", lower: true }),
      unique: true,
    },
    description: text("description", {
      label: "Description",
      max: 1000,
      long: true,
    }),
    content: { ...text("content", { long: true }), defaultValue: "" },
    image: jsonField("image", () => null),
    metaTitle: text("metaTitle", { label: "Meta title", max: 70 }),
    metaDescription: text("metaDescription", {
      label: "Meta description",
      max: 160,
    }),
    metaKeywords: text("metaKeywords", { label: "Meta keywords", max: 255 }),
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    legacyId: legacyIdColumn,
    previousSlugs: jsonField("previousSlugs", () => []),
    ...timestampColumns,
  },
  { tableName: "categories" },
);

export default Category;
