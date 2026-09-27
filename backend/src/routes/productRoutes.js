import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getRelatedProducts,
  toggleProductFeatured,
  toggleProductStatus,
  updateProduct,
} from "../controllers/productController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { handleProductUpload } from "../middleware/uploadMiddleware.js";
import {
  validateCreateProduct,
  validateFeaturedUpdate,
  validateStatusUpdate,
  validateUpdateProduct,
} from "../middleware/validateProduct.js";

const router = Router();

router.use(protectAdmin);

router.get("/", getProducts);
router.get("/:id/related", getRelatedProducts);
router.get("/:id", getProductById);
router.post("/", handleProductUpload, validateCreateProduct, createProduct);
router.put("/:id", handleProductUpload, validateUpdateProduct, updateProduct);
router.patch("/:id/status", validateStatusUpdate, toggleProductStatus);
router.patch("/:id/featured", validateFeaturedUpdate, toggleProductFeatured);
router.delete("/:id", deleteProduct);

export default router;
