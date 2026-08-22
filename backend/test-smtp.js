// Standalone SMTP checker — verifies the same env/config the app's mailer
// uses, without touching the database or the website.
//
// Usage (from backend/, with SMTP_* vars in backend/.env or the shell):
//   node test-smtp.js
//
// Step 1 verifies connection + login; step 2 sends a real test email to
// ENQUIRY_TO (fallback: SMTP_USER). Secrets are never printed.

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env"), quiet: true });

// When BREVO_API_KEY is set, test the Brevo HTTP path (what production
// uses on hosts that block SMTP) instead of raw SMTP.
if (process.env.BREVO_API_KEY) {
  const { sendViaBrevo } = await import("./src/utils/mailer.js");
  const to = process.env.ENQUIRY_TO || "info@naturesnaturalindia.com";
  console.log("BREVO_API_KEY is set — testing the Brevo HTTP API path.");
  console.log(`  Recipient (ENQUIRY_TO): ${to}`);
  try {
    await sendViaBrevo({
      name: "SMTP Test",
      email: "test@example.com",
      message: "If you can read this, the Brevo email setup works.",
    });
    console.log("✓ Brevo accepted the email. Check the inbox (and Spam) of " + to);
  } catch (err) {
    console.error("✗ Brevo send failed:", err.message);
    process.exit(1);
  }
  process.exit(0);
}

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
const to = process.env.ENQUIRY_TO || SMTP_USER;

console.log("SMTP configuration seen by the app:");
console.log(`  SMTP_HOST: ${SMTP_HOST || "(missing!)"}`);
console.log(`  SMTP_PORT: ${SMTP_PORT || "(missing — will default to 587)"}`);
console.log(`  SMTP_USER: ${SMTP_USER || "(missing!)"}`);
console.log(
  `  SMTP_PASS: ${
    SMTP_PASS
      ? `set (${SMTP_PASS.length} chars${/\s/.test(SMTP_PASS) ? ", CONTAINS SPACES — remove them!" : ""}${
          SMTP_PASS.replace(/\s/g, "").length !== 16
            ? ", WARNING: a Gmail App Password is exactly 16 chars"
            : ""
        })`
      : "(missing!)"
  }`,
);
console.log(`  Recipient (ENQUIRY_TO): ${to || "(missing!)"}`);

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error("\n✗ Missing SMTP_HOST/SMTP_USER/SMTP_PASS — set them first.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: Number(SMTP_PORT) === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

try {
  console.log("\nStep 1/2: connecting and authenticating…");
  await transporter.verify();
  console.log("✓ Connection + login OK — SMTP credentials are correct.");
} catch (err) {
  console.error("✗ SMTP verify failed:", {
    message: err.message,
    code: err.code,
    command: err.command,
    responseCode: err.responseCode,
    response: err.response,
  });
  process.exit(1);
}

try {
  console.log(`\nStep 2/2: sending a test email to ${to}…`);
  const info = await transporter.sendMail({
    from: `"Natures Natural India" <${process.env.ENQUIRY_FROM || SMTP_USER}>`,
    to,
    subject: "SMTP test — website enquiry mail setup",
    text: "If you can read this, the website's SMTP configuration works.",
  });
  console.log(`✓ Sent! id: ${info.messageId}, server said: ${info.response}`);
  console.log("Check the inbox (and Spam) of " + to);
} catch (err) {
  console.error("✗ sendMail failed:", {
    message: err.message,
    code: err.code,
    command: err.command,
    responseCode: err.responseCode,
    response: err.response,
  });
  process.exit(1);
}
