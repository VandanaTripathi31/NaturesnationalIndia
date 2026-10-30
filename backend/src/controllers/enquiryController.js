import { Op } from "sequelize";
import { Enquiry } from "../db/models/index.js";
import { sendEnquiryEmail } from "../utils/mailer.js";
import { likeContains, parseId } from "../utils/dbHelpers.js";

// Admin responses carry both `id` and `_id` (same value): the dashboard
// still reads `_id`.
function formatEnquiry(enquiry) {
  const { mongoId: _mongoId, ...fields } = enquiry.toJSON();
  return { ...fields, id: String(enquiry.id), _id: String(enquiry.id) };
}

const ENQUIRY_STATUSES = ["new", "read", "responded", "archived"];

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
      where: {
        email: String(email).toLowerCase(),
        message: message ?? "",
        createdAt: { [Op.gte]: new Date(Date.now() - 60_000) },
      },
    });
    if (recent) {
      return res.status(200).json({
        message: "Enquiry already received.",
        id: String(recent.id),
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
      id: String(enquiry.id),
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
    const where = {};
    if (req.query.status) where.status = req.query.status;

    // Free-text search across the fields shown in the admin table.
    const search = req.query.q?.trim() ?? req.query.search?.trim() ?? "";
    if (search) {
      const like = { [Op.like]: likeContains(search) };
      where[Op.or] = [
        { name: like },
        { email: like },
        { phone: like },
        { country: like },
        { category: like },
        { message: like },
      ];
    }

    const { rows: items, count: total } = await Enquiry.findAndCountAll({
      where,
      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],
      offset: (page - 1) * limit,
      limit,
    });

    return res.status(200).json({
      enquiries: items.map(formatEnquiry),
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
    if (!ENQUIRY_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${ENQUIRY_STATUSES.join(", ")}`,
      });
    }
    const id = parseId(req.params.id);
    const enquiry = id ? await Enquiry.findByPk(id) : null;
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    await enquiry.update({ status });
    return res.status(200).json({ enquiry: formatEnquiry(enquiry) });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ message: "Invalid status" });
    }
    return res
      .status(500)
      .json({ message: "Failed to update enquiry", error: error.message });
  }
}

// DELETE /api/enquiries/:id — admin delete (protected).
export async function deleteEnquiry(req, res) {
  try {
    const id = parseId(req.params.id);
    const enquiry = id ? await Enquiry.findByPk(id) : null;
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    await enquiry.destroy();
    return res.status(200).json({ message: "Enquiry deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete enquiry", error: error.message });
  }
}
