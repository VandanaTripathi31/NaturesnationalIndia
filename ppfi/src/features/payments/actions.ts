"use server";

import { ROLES } from "@/config/roles";
import { publicEnv } from "@/config/env";
import { getCourseBySlug } from "@/features/content";
import { getCurrentUser } from "@/lib/auth/session";
import { getRazorpay, isRazorpayConfigured } from "@/lib/razorpay";
import { connectToDatabase } from "@/server/db/mongoose";
import { Enrollment } from "@/server/db/models/Enrollment";
import { Payment } from "@/server/db/models/Payment";

export type CreateOrderResult =
  | {
      success: true;
      orderId: string;
      paymentId: string;
      amount: number;
      currency: string;
      keyId: string;
      courseTitle: string;
      prefill: { name: string; email: string };
    }
  | { success: false; error: string };

/**
 * Create a Razorpay order for a course purchase (B2C). Guards: auth as
 * STUDENT, course exists and is purchasable, not already enrolled.
 */
export async function createEnrollmentOrder(courseSlug: string): Promise<CreateOrderResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Please sign in to enrol." };
  if (user.role !== ROLES.STUDENT) {
    return { success: false, error: "Only students can enrol in courses." };
  }

  const course = await getCourseBySlug(courseSlug);
  if (!course) return { success: false, error: "Course not found." };
  if (course.comingSoon || course.price <= 0) {
    return { success: false, error: "This course is not open for enrolment yet." };
  }

  if (!isRazorpayConfigured()) {
    return { success: false, error: "Payments are not configured. Please try again later." };
  }

  try {
    await connectToDatabase();

    const existing = await Enrollment.findOne({
      student: user.id,
      courseSlug,
    }).lean();
    if (existing) {
      return { success: false, error: "You are already enrolled in this course." };
    }

    const amount = course.price * 100; // paise
    const order = await getRazorpay().orders.create({
      amount,
      currency: "INR",
      receipt: `enr_${user.id.slice(-6)}_${Date.now()}`,
      notes: { courseSlug, studentId: user.id },
    });

    const payment = await Payment.create({
      student: user.id,
      courseSlug,
      courseTitle: course.title,
      amount,
      currency: "INR",
      razorpayOrderId: order.id,
      status: "created",
    });

    return {
      success: true,
      orderId: order.id,
      paymentId: String(payment._id),
      amount,
      currency: "INR",
      keyId: publicEnv.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
      courseTitle: course.title,
      prefill: { name: user.name ?? "", email: user.email ?? "" },
    };
  } catch (error) {
    console.error("[createEnrollmentOrder]", error);
    return { success: false, error: "Could not start payment. Please try again." };
  }
}
