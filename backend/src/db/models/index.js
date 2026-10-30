import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize.js";
import Admin from "./Admin.js";
import Category from "./Category.js";
import Product from "./Product.js";
import Blog from "./Blog.js";
import BlogCategory from "./BlogCategory.js";
import Enquiry from "./Enquiry.js";

const BlogBlogCategory = sequelize.define(
  "BlogBlogCategory",
  {
    blogId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    blogCategoryId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: "blog_blog_categories", timestamps: false },
);

Product.belongsTo(Category, { as: "category", foreignKey: "categoryId" });
Category.hasMany(Product, { as: "products", foreignKey: "categoryId" });

Blog.belongsToMany(BlogCategory, {
  as: "categories",
  through: BlogBlogCategory,
  foreignKey: "blogId",
  otherKey: "blogCategoryId",
});
BlogCategory.belongsToMany(Blog, {
  as: "blogs",
  through: BlogBlogCategory,
  foreignKey: "blogCategoryId",
  otherKey: "blogId",
});

export { sequelize, BlogBlogCategory, Admin, Category, Product, Blog, BlogCategory, Enquiry };
