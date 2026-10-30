import { DataTypes } from "sequelize";

// Attribute helpers shared by the models.

// Trimmed string column. `lower` lowercases (slugs). `max` adds a length
// validator with the wording the old Mongoose schemas used.
export function text(name, { max, label, lower = false, required = false, long = false } = {}) {
  const validate = {};
  if (max) {
    validate.len = { args: [0, max], msg: `${label} cannot exceed ${max} characters` };
  }
  if (required) {
    validate.notNull = { msg: `${label} is required` };
    validate.notEmpty = { msg: `${label} is required` };
  }
  return {
    type: long ? DataTypes.TEXT("long") : DataTypes.STRING(255),
    allowNull: !required,
    validate,
    set(value) {
      let v = typeof value === "string" ? value.trim() : value;
      if (lower && typeof v === "string") v = v.toLowerCase();
      this.setDataValue(name, v);
    },
  };
}

// JSON stored in a LONGTEXT column: identical behavior on MySQL 8 and MariaDB.
// `fallback` is a function so every row gets a fresh [] / null.
export function jsonField(name, fallback) {
  return {
    type: DataTypes.TEXT("long"),
    allowNull: true,
    get() {
      const raw = this.getDataValue(name);
      if (raw === null || raw === undefined || raw === "") return fallback();
      try {
        return typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch {
        return fallback();
      }
    },
    set(value) {
      this.setDataValue(
        name,
        value === null || value === undefined ? null : JSON.stringify(value),
      );
    },
  };
}

export const idColumn = {
  type: DataTypes.INTEGER.UNSIGNED,
  primaryKey: true,
  autoIncrement: true,
};

export const mongoIdColumn = {
  type: DataTypes.STRING(24),
  allowNull: true,
  unique: true,
};

export const legacyIdColumn = {
  type: DataTypes.INTEGER,
  allowNull: true,
  unique: true,
};
