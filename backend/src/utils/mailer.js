import nodemailer from "nodemailer";

// Enquiry emails are sent over plain SMTP via nodemailer, using the
// company's Google Workspace mailbox:
//
//   SMTP_HOST=smtp.gmail.com
//   SMTP_PORT=465            (implicit TLS; 587 with STARTTLS also works)
//   SMTP_USER=<workspace mailbox, e.g. info@naturesnaturalindia.com>
//   SMTP_PASS=<16-char Google App Password — requires 2-Step Verification>
//   ENQUIRY_TO  (optional)   recipient inbox, defaults to the company inbox
//   ENQUIRY_FROM (optional)  must be the SMTP_USER mailbox or one of its
//                            Gmail "Send mail as" aliases, otherwise Google
//                            silently rewrites it to SMTP_USER
//
// Email is optional: if SMTP is not configured, sendEnquiryEmail becomes a
// no-op (logged) so enquiries still save to the database/admin dashboard.

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
    // Fail fast with a loggable error instead of hanging for minutes when
    // the host blocks outbound SMTP ports or the connection stalls.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return transporter;
}

// Checks SMTP connectivity + login once at startup so a broken mail setup
// is visible in the deploy logs immediately, instead of surfacing only when
// the first enquiry silently fails. The error codes distinguish the causes:
// ETIMEDOUT/ECONNECTION = host blocks outbound SMTP or wrong host/port,
// EAUTH = wrong user/app password. Never throws and never logs credentials.
export async function verifyMailer() {
  const tx = getTransport();
  if (!tx) return false;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER } = process.env;
  try {
    await tx.verify();
    console.log(
      `[mailer] SMTP verified: ${SMTP_HOST}:${SMTP_PORT || 587} as ${SMTP_USER} — enquiry emails enabled.`,
    );
    return true;
  } catch (err) {
    console.error(
      "[mailer] SMTP verification FAILED — enquiry emails will NOT be delivered:",
      {
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        message: err.message,
        code: err.code,
        command: err.command,
        responseCode: err.responseCode,
        response: err.response,
      },
    );
    return false;
  }
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

// Sends the enquiry notification to the company inbox. Returns true on
// success, false if skipped/failed — never throws (caller stays resilient).
export async function sendEnquiryEmail(enquiry) {
  try {
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
