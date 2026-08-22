import nodemailer from "nodemailer";

// Enquiry emails go out over one of two transports:
//
//   1. Brevo HTTP API (preferred when BREVO_API_KEY is set) — sends over
//      HTTPS/443, which works on hosts that block outbound SMTP ports
//      (Render's free tier does). The sender address must be verified in
//      the Brevo account.
//   2. Plain SMTP via nodemailer (SMTP_HOST/SMTP_USER/SMTP_PASS) — used
//      when no Brevo key is configured and the host allows SMTP.
//
// Email is optional either way: if neither transport is configured,
// sendEnquiryEmail becomes a no-op (logged) so enquiries still save.

// Lazily-built SMTP transport.
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

// Send through Brevo's transactional-email HTTP API (https, port 443).
export async function sendViaBrevo(enquiry) {
  const { to, from, html, subject } = buildMessage(enquiry);
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Natures Natural India", email: from },
      to: [{ email: to }],
      replyTo: enquiry.email ? { email: enquiry.email } : undefined,
      subject,
      htmlContent: html,
    }),
  });
  const body = await res.text();
  if (!res.ok) {
    // Brevo's error body says exactly what's wrong (unverified sender,
    // bad key, etc.) and never contains the key itself — safe to log.
    throw new Error(`Brevo API ${res.status}: ${body}`);
  }
  const messageId = (() => {
    try {
      return JSON.parse(body).messageId;
    } catch {
      return body;
    }
  })();
  console.log(`[mailer] Enquiry email sent to ${to} via Brevo (id: ${messageId})`);
  return true;
}

async function sendViaSmtp(enquiry) {
  const tx = getTransport();
  if (!tx) return false;
  const { to, from, html, subject } = buildMessage(enquiry);
  const info = await tx.sendMail({
    from: `"Natures Natural India" <${from}>`,
    to,
    replyTo: enquiry.email,
    subject,
    html,
  });
  console.log(
    `[mailer] Enquiry email sent to ${to} via SMTP (id: ${info.messageId}, response: ${info.response})`,
  );
  return true;
}

// Sends the enquiry notification to the company inbox. Returns true on
// success, false if skipped/failed — never throws (caller stays resilient).
export async function sendEnquiryEmail(enquiry) {
  try {
    if (process.env.BREVO_API_KEY) {
      return await sendViaBrevo(enquiry);
    }
    return await sendViaSmtp(enquiry);
  } catch (err) {
    // Log the transport diagnostics — without these, "Connection timeout"
    // vs "auth rejected" vs "sender refused" are indistinguishable in
    // production logs. Never log credentials.
    console.error("[mailer] Failed to send enquiry email:", {
      message: err.message,
      code: err.code,
      command: err.command,
      responseCode: err.responseCode,
      response: err.response,
    });
    return false;
  }
}
