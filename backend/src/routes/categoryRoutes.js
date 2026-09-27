import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  toggleCategoryStatus,
  updateCategory,
} from "../controllers/categoryController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { handleCategoryUpload } from "../middleware/uploadMiddleware.js";
import {
  validateCreateCategory,
  validateStatusUpdate,
  validateUpdateCategory,
} from "../middleware/validateCategory.js";

const router = Router();

router.use(protectAdmin);

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", handleCategoryUpload, validateCreateCategory, createCategory);
router.put("/:id", handleCategoryUpload, validateUpdateCategory, updateCategory);
router.patch("/:id/status", validateStatusUpdate, toggleCategoryStatus);
router.delete("/:id", deleteCategory);

export default router;
