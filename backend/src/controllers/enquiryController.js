import Enquiry from "../models/Enquiry.js";
import { sendEnquiryEmail } from "../utils/mailer.js";

// Verify a Google reCAPTCHA token. If RECAPTCHA_SECRET_KEY is not configured,
// verification is skipped so the form keeps working until keys are added.
async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false, error: "Missing captcha token" };

  try {
    const params = new URLSearchParams({ secret, response: token });
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = await res.json();
    return { ok: !!data.success, error: data.success ? null : "Captcha failed" };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// POST /api/public/enquiries  — public form submission.
export async function createEnquiry(req, res) {
  try {
    const { name, email, phone, country, category, quantity, message, source } =
      req.body ?? {};

    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Name and email are required." });
    }

    const captcha = await verifyRecaptcha(
      req.body?.captchaToken ?? req.body?.recaptchaToken,
    );
    if (!captcha.ok) {
      return res.status(400).json({ message: captcha.error });
    }

    // Prevent duplicate submissions: same email + message within 60s
    // (double-clicks, retries) returns the existing record instead of a dup.
    const recent = await Enquiry.findOne({
      email: String(email).toLowerCase(),
      message: message ?? "",
      createdAt: { $gte: new Date(Date.now() - 60_000) },
    });
    if (recent) {
      return res.status(200).json({
        message: "Enquiry already received.",
        id: recent._id.toString(),
        duplicate: true,
      });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      country,
      category,
      quantity,
      message,
      source,
    });

    // Email the company inbox (non-blocking; failure never blocks the user).
    sendEnquiryEmail(enquiry).catch(() => {});

    return res.status(201).json({
      message: "Enquiry submitted successfully.",
      id: enquiry._id.toString(),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to submit enquiry", error: error.message });
  }
}

// GET /api/enquiries — admin listing (protected).
export async function listEnquiries(req, res) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Number.parseInt(req.query.limit, 10) || 25);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    // Free-text search across the fields shown in the admin table.
    const search = req.query.q?.trim() ?? req.query.search?.trim() ?? "";
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(safe, "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { country: regex },
        { category: regex },
        { message: regex },
      ];
    }

    const [items, total] = await Promise.all([
      Enquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Enquiry.countDocuments(filter),
    ]);

    return res.status(200).json({
      enquiries: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch enquiries", error: error.message });
  }
}

// PATCH /api/enquiries/:id — admin update status (protected).
export async function updateEnquiryStatus(req, res) {
  try {
    const { status } = req.body ?? {};
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true },
    );
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    return res.status(200).json({ enquiry });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update enquiry", error: error.message });
  }
}

// DELETE /api/enquiries/:id — admin delete (protected).
export async function deleteEnquiry(req, res) {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    return res.status(200).json({ message: "Enquiry deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete enquiry", error: error.message });
  }
}
