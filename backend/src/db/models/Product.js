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

const Product = sequelize.define(
  "Product",
  {
    id: idColumn,
    mongoId: mongoIdColumn,
    name: text("name", { required: true, label: "Product name", max: 160 }),
    slug: {
      ...text("slug", { required: true, label: "Slug", lower: true }),
      unique: true,
    },
    description: text("description", {
      label: "Description",
      max: 5000,
      long: true,
    }),
    botanicalName: text("botanicalName", { label: "Botanical name", max: 160 }),
    origin: text("origin", { label: "Origin", max: 120 }),
    extractionMethod: text("extractionMethod", {
      label: "Extraction method",
      max: 120,
    }),
    benefits: jsonField("benefits", () => []),
    uses: jsonField("uses", () => []),
    featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: { notNull: { msg: "Category is required" } },
    },
    images: jsonField("images", () => []),
    metaTitle: text("metaTitle", { label: "Meta title", max: 70 }),
    metaDescription: text("metaDescription", {
      label: "Meta description",
      max: 160,
    }),
    metaKeywords: text("metaKeywords", { label: "Meta keywords", max: 255 }),
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    productCode: text("productCode", { label: "Product code", max: 120 }),
    overview: text("overview", { long: true }),
    blendsWith: text("blendsWith", { long: true }),
    history: text("history", { long: true }),
    storage: text("storage", { long: true }),
    precautions: text("precautions", { long: true }),
    faqs: text("faqs", { long: true }),
    specifications: jsonField("specifications", () => []),
    legacyId: legacyIdColumn,
    previousSlugs: jsonField("previousSlugs", () => []),
    ...timestampColumns,
  },
  { tableName: "products" },
);

export default Product;
