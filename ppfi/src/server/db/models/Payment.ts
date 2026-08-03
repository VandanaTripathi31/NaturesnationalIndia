import { Schema, model, models, Types, type InferSchemaType, type Model } from "mongoose";

/**
 * Payment — a B2C course purchase via Razorpay (Handover Doc §3.1, §6).
 * A successful, signature-verified payment creates the linked Enrollment.
 */
const paymentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseSlug: { type: String, required: true },
    courseTitle: { type: String, required: true },
    amount: { type: Number, required: true }, // in paise
    currency: { type: String, default: "INR" },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String, default: null },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
      index: true,
    },
  },
  { timestamps: true },
);

export type PaymentDocument = InferSchemaType<typeof paymentSchema> & { _id: Types.ObjectId };

export const Payment: Model<PaymentDocument> =
  (models.Payment as Model<PaymentDocument>) ??
  model<PaymentDocument>("Payment", paymentSchema);
