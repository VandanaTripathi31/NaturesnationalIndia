import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "../sequelize.js";
import { idColumn, mongoIdColumn, text } from "../fields.js";

const Admin = sequelize.define(
  "Admin",
  {
    id: idColumn,
    mongoId: mongoIdColumn,
    name: text("name", { required: true, label: "Name" }),
    email: {
      ...text("email", { required: true, label: "Email", lower: true }),
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { len: { args: [6, 255], msg: "Password must be at least 6 characters" } },
    },
    role: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "admin" },
  },
  {
    tableName: "admins",
    defaultScope: { attributes: { exclude: ["password"] } },
    scopes: { withPassword: { attributes: { include: ["password"] } } },
    hooks: {
      beforeSave: async (admin, options) => {
        // `hooks: false` on bulk copies keeps migrated hashes untouched.
        if (!admin.changed("password")) return;
        admin.password = await bcrypt.hash(admin.password, 12);
        if (options.fields && !options.fields.includes("password")) {
          options.fields.push("password");
        }
      },
    },
  },
);

Admin.prototype.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default Admin;
