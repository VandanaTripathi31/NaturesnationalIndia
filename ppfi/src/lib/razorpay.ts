import Razorpay from "razorpay";
import { createHmac } from "crypto";

let client: Razorpay | null = null;

/** Lazily-constructed Razorpay client. Throws only when actually used. */
export function getRazorpay(): Razorpay {
  if (client) return client;
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error("Razorpay keys are not configured.");
  }
  client = new Razorpay({ key_id, key_secret });
  return client;
}

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

/** Verify the checkout signature Razorpay returns to the browser. */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");
  return expected === params.signature;
}
