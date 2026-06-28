import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

function signAdminToken(admin) {
  return jwt.sign(
    {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
}

function formatAdmin(admin) {
  return {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
}

export async function login(req, res) {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signAdminToken(admin);

    return res.status(200).json({
      token,
      admin: formatAdmin(admin),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to sign in",
      error: error.message,
    });
  }
}

export async function getProfile(req, res) {
  return res.status(200).json({
    admin: formatAdmin(req.admin),
  });
}
