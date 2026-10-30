import jwt from "jsonwebtoken";
import { Admin } from "../db/models/index.js";
import { parseId } from "../utils/dbHelpers.js";

export async function protectAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = parseId(decoded.id);
    const admin = adminId ? await Admin.findByPk(adminId) : null;

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.admin = admin;
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
