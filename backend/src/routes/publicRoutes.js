import { Router } from "express";
import {
  getPublicCategories,
  getPublicCategoryBySlug,
  getPublicProductBySlug,
  getPublicRelatedProducts,
} from "../controllers/publicController.js";

const router = Router();

router.get("/categories", getPublicCategories);
router.get("/categories/:slug", getPublicCategoryBySlug);
router.get("/products/:slug/related", getPublicRelatedProducts);
router.get("/products/:slug", getPublicProductBySlug);

export default router;
