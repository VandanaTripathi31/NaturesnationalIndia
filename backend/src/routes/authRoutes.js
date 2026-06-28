import { Router } from "express";
import { getProfile, login } from "../controllers/authController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.get("/me", protectAdmin, getProfile);

export default router;
