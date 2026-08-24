// mailer.js — sends enquiry emails via Brevo's transactional email API
// (HTTPS) instead of raw SMTP. Raw SMTP to smtp.gmail.com was timing out
// at the CONN step (host/network blocking outbound SMTP), not an auth
// issue — switching to an HTTPS API sidesteps that entirely.
//
// Required:
//   BREVO_API_KEY   — from the Brevo dashboard (already in .env)
// Optional:
//   ENQUIRY_TO      — recipient inbox, defaults to the company inbox
//   ENQUIRY_FROM    — sender address. IMPORTANT: this must be a "Verified
//                     sender" in Brevo (Senders, Domains & Dedicated IPs →
//                     Senders) or Brevo will reject the send. Defaults to
//                     SMTP_USER or the company inbox.
//
// Email is optional: if BREVO_API_KEY is not configured, sendEnquiryEmail
// becomes a no-op (logged) so enquiries still save to the database/admin
// dashboard.

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_ACCOUNT_URL = "https://api.brevo.com/v3/account";

function getApiKey() {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    console.warn(
      "[mailer] BREVO_API_KEY not configured — enquiry emails disabled.",
    );
    return null;
  }
  return key;
}

// Checks the API key is valid once at startup, so a broken mail setup is
// visible in the deploy logs immediately, instead of surfacing only when
// the first enquiry silently fails.
export async function verifyMailer() {
  const key = getApiKey();
  if (!key) return false;
  try {
    const res = await fetch(BREVO_ACCOUNT_URL, {
      headers: { "api-key": key },
    });
    if (!res.ok) {
      console.error(
        `[mailer] Brevo API key verification FAILED (HTTP ${res.status}) — enquiry emails will NOT be delivered.`,
      );
      return false;
    }
    console.log("[mailer] Brevo API key verified — enquiry emails enabled.");
    return true;
  } catch (err) {
    console.error("[mailer] Brevo API unreachable:", err.message);
    return false;
  }
}

const row = (label, value) =>
  value
    ? `<tr><td style="padding:4px 12px 4px 0;color:#6b5b4d;font-weight:600">${label}</td><td style="padding:4px 0">${value}</td></tr>`
    : "";

function buildMessage(enquiry) {
  const to = process.env.ENQUIRY_TO || "info@naturesnaturalindia.com";
  const from =
    process.env.ENQUIRY_FROM ||
    process.env.SMTP_USER ||
    "info@naturesnaturalindia.com";
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
  return { to, from, html, subject: `New Enquiry — ${enquiry.name}` };
}

// Sends the enquiry notification to the company inbox via Brevo's HTTPS
// API. Returns true on success, false if skipped/failed — never throws
// (caller stays resilient).
export async function sendEnquiryEmail(enquiry) {
  const key = getApiKey();
  if (!key) return false;
  try {
    const { to, from, html, subject } = buildMessage(enquiry);
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": key,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: from, name: "Natures Natural India" },
        to: [{ email: to }],
        replyTo: { email: enquiry.email },
        subject,
        htmlContent: html,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[mailer] Failed to send enquiry email:", {
        status: res.status,
        response: data,
      });
      return false;
    }
    console.log(
      `[mailer] Enquiry email sent to ${to} via Brevo (id: ${data.messageId})`,
    );
    return true;
  } catch (err) {
    console.error("[mailer] Failed to send enquiry email:", err.message);
    return false;
  }
}
