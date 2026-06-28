import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

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
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.admin = admin;
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
