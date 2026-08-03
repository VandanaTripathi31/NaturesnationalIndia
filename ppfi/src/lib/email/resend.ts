import { Resend } from "resend";

import { siteConfig } from "@/config/site";
import { formatINR } from "@/lib/utils";

let client: Resend | null = null;

function getResend(): Resend | null {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client = new Resend(key);
  return client;
}

const FROM = () => process.env.RESEND_FROM_EMAIL ?? "PPFI <onboarding@resend.dev>";

/**
 * Send an enrollment confirmation email. No-ops (with a log) when Resend is
 * not configured, so payment flows never fail because of email.
 */
export async function sendEnrollmentConfirmation(params: {
  to: string;
  name: string;
  courseTitle: string;
  amount: number; // in paise
}): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] Resend not configured — skipping enrollment confirmation.");
    return;
  }

  const amount = formatINR(params.amount / 100);
  try {
    await resend.emails.send({
      from: FROM(),
      to: params.to,
      subject: `You're enrolled in ${params.courseTitle}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#0a0a0a">
          <h1 style="font-size:20px">Welcome aboard, ${params.name.split(" ")[0]} 🎬</h1>
          <p>Your enrollment in <strong>${params.courseTitle}</strong> is confirmed.</p>
          <p style="color:#666">Amount paid: <strong>${amount}</strong></p>
          <p>You can access your course from your dashboard anytime.</p>
          <p style="margin-top:24px">
            <a href="${siteConfig.url}/dashboard"
               style="background:#0a0a0a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">
              Go to dashboard
            </a>
          </p>
          <p style="color:#999;font-size:12px;margin-top:32px">${siteConfig.name} — ${siteConfig.tagline}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[email] Failed to send enrollment confirmation:", error);
  }
}
