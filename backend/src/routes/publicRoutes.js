import { Router } from "express";
import {
  getPublicCategories,
  getPublicCategoryBySlug,
  getPublicProductBySlug,
  getPublicRelatedProducts,
  searchPublicProducts,
} from "../controllers/publicController.js";
import { createEnquiry } from "../controllers/enquiryController.js";
import {
  getPublicBlogs,
  getPublicBlogBySlug,
  getPublicRelatedBlogs,
} from "../controllers/publicBlogController.js";

const router = Router();

router.get("/categories", getPublicCategories);
router.get("/categories/:slug", getPublicCategoryBySlug);
router.get("/search", searchPublicProducts);
router.get("/products/:slug/related", getPublicRelatedProducts);
router.get("/products/:slug", getPublicProductBySlug);
router.post("/enquiries", createEnquiry);

router.get("/blogs", getPublicBlogs);
router.get("/blogs/:slug/related", getPublicRelatedBlogs);
router.get("/blogs/:slug", getPublicBlogBySlug);

export default router;
