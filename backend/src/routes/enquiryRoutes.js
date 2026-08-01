import { Router } from "express";
import {
  listEnquiries,
  updateEnquiryStatus,
} from "../controllers/enquiryController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// All admin enquiry management routes require a logged-in admin.
router.use(protectAdmin);

router.get("/", listEnquiries);
router.patch("/:id", updateEnquiryStatus);

export default router;
