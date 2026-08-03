import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { sendEnrollmentConfirmation } from "@/lib/email/resend";
import { connectToDatabase } from "@/server/db/mongoose";
import { Enrollment } from "@/server/db/models/Enrollment";
import { Payment } from "@/server/db/models/Payment";

const bodySchema = z.object({
  paymentDbId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const {
    paymentDbId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = parsed.data;

  const valid = verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  await connectToDatabase();
  const payment = await Payment.findById(paymentDbId);

  if (!payment || String(payment.student) !== user.id) {
    return NextResponse.json({ ok: false, error: "Payment not found" }, { status: 404 });
  }
  if (payment.razorpayOrderId !== razorpay_order_id) {
    return NextResponse.json({ ok: false, error: "Order mismatch" }, { status: 400 });
  }

  if (!valid) {
    payment.status = "failed";
    await payment.save();
    return NextResponse.json({ ok: false, error: "Signature verification failed" }, { status: 400 });
  }

  // Idempotent: only act on the first successful verification.
  if (payment.status !== "paid") {
    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    await Enrollment.updateOne(
      { student: payment.student, courseSlug: payment.courseSlug },
      {
        $setOnInsert: {
          student: payment.student,
          courseSlug: payment.courseSlug,
          status: "active",
          progress: 0,
          source: "b2c",
        },
      },
      { upsert: true },
    );

    await sendEnrollmentConfirmation({
      to: user.email ?? "",
      name: user.name ?? "there",
      courseTitle: payment.courseTitle,
      amount: payment.amount,
    });
  }

  return NextResponse.json({ ok: true });
}
