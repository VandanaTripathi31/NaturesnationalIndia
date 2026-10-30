import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize.js";
import { idColumn, mongoIdColumn, text } from "../fields.js";

const Enquiry = sequelize.define(
  "Enquiry",
  {
    id: idColumn,
    mongoId: mongoIdColumn,
    name: text("name", { required: true, label: "Name", max: 120 }),
    email: text("email", { required: true, label: "Email", max: 160, lower: true }),
    phone: text("phone", { label: "Phone", max: 40 }),
    country: text("country", { label: "Country", max: 80 }),
    category: text("category", { label: "Category", max: 120 }),
    quantity: text("quantity", { label: "Quantity", max: 80 }),
    message: text("message", { label: "Message", max: 2000, long: true }),
    source: text("source", { label: "Source", max: 200 }),
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "new",
      validate: {
        isIn: {
          args: [["new", "read", "responded", "archived"]],
          msg: "Invalid status",
        },
      },
    },
  },
  { tableName: "enquiries" },
);

export default Enquiry;
