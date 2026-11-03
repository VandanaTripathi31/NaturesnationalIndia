import { Router } from "express";
import {
  deleteEnquiry,
  listEnquiries,
  updateEnquiryStatus,
} from "../controllers/enquiryController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { validateObjectIdParam } from "../middleware/validateObjectId.js";

const router = Router();

// All admin enquiry management routes require a logged-in admin.
router.use(protectAdmin);
router.param("id", validateObjectIdParam);

router.get("/", listEnquiries);
router.patch("/:id", updateEnquiryStatus);
router.delete("/:id", deleteEnquiry);

export default router;
