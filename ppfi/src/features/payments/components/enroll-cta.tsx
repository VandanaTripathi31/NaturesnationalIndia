"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROLES } from "@/config/roles";
import { createEnrollmentOrder } from "@/features/payments/actions";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function EnrollCta({ courseSlug }: { courseSlug: string }) {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Not signed in → send to login and back.
  if (status !== "authenticated") {
    return (
      <Button
        className="w-full"
        onClick={() => router.push(`/login?callbackUrl=/courses/${courseSlug}`)}
      >
        Sign in to enrol
      </Button>
    );
  }

  // Admins don't purchase courses.
  if (session.user.role === ROLES.ADMIN) {
    return (
      <Button className="w-full" variant="outline" disabled>
        Admins cannot enrol
      </Button>
    );
  }

  async function handleEnroll() {
    setLoading(true);
    setError(null);

    const order = await createEnrollmentOrder(courseSlug);
    if (!order.success) {
      setError(order.error);
      setLoading(false);
      return;
    }

    const ready = await loadRazorpayScript();
    if (!ready || !window.Razorpay) {
      setError("Could not load the payment gateway. Please try again.");
      setLoading(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "Pixel Perfect Films Institute",
      description: order.courseTitle,
      order_id: order.orderId,
      prefill: order.prefill,
      theme: { color: "#0a0a0a" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentDbId: order.paymentId, ...response }),
        });
        const data = await res.json();
        if (data.ok) {
          router.push(`/payment/success?course=${courseSlug}`);
        } else {
          router.push("/payment/failure");
        }
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    });

    rzp.open();
  }

  return (
    <div>
      <Button className="w-full" onClick={handleEnroll} disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : null}
        Enrol now
      </Button>
      {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
