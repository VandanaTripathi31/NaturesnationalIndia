import nodemailer from "nodemailer";

// Lazily-built SMTP transport. Email is optional: if SMTP env vars are not
// set, sendEnquiryEmail becomes a no-op (logged) so enquiries still save.
let transporter = null;
let checked = false;

function getTransport() {
  if (checked) return transporter;
  checked = true;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn(
      "[mailer] SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS) — enquiry emails disabled.",
    );
    return null;
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

const row = (label, value) =>
  value ? `<tr><td style="padding:4px 12px 4px 0;color:#6b5b4d;font-weight:600">${label}</td><td style="padding:4px 0">${value}</td></tr>` : "";

// Sends the enquiry notification to the company inbox. Returns true on
// success, false if skipped/failed — never throws (caller stays resilient).
export async function sendEnquiryEmail(enquiry) {
  try {
    const tx = getTransport();
    if (!tx) return false;

    const to = process.env.ENQUIRY_TO || process.env.SMTP_USER;
    const from = process.env.ENQUIRY_FROM || process.env.SMTP_USER;

    const html = `
      <h2 style="font-family:Arial,sans-serif;color:#3a2c1a">New Website Enquiry</h2>
      <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
        ${row("Name", enquiry.name)}
        ${row("Email", enquiry.email)}
        ${row("Phone", enquiry.phone)}
        ${row("Country", enquiry.country)}
        ${row("Product/Category", enquiry.category)}
        ${row("Quantity", enquiry.quantity)}
        ${row("Message", enquiry.message)}
        ${row("Source page", enquiry.source)}
        ${row("Received", new Date(enquiry.createdAt || Date.now()).toLocaleString())}
      </table>
    `;

    await tx.sendMail({
      from: `"Natures Natural India" <${from}>`,
      to,
      replyTo: enquiry.email,
      subject: `New Enquiry — ${enquiry.name}`,
      html,
    });
    return true;
  } catch (err) {
    console.error("[mailer] Failed to send enquiry email:", err.message);
    return false;
  }
}
