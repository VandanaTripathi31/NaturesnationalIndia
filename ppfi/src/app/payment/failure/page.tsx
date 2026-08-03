import Link from "next/link";
import type { Metadata } from "next";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment failed", robots: { index: false } };

export default function PaymentFailurePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <XCircle className="size-9 text-destructive" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
        Payment could not be completed
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Your payment was not successful and you have not been charged. You can try again
        from the course page.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/courses">Back to courses</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact support</Link>
        </Button>
      </div>
    </div>
  );
}
