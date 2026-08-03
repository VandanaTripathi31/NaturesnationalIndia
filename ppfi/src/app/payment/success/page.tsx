import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCourseBySlug } from "@/features/content";

export const metadata: Metadata = { title: "Payment successful", robots: { index: false } };

async function SuccessContent({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course: slug } = await searchParams;
  const course = slug ? await getCourseBySlug(slug) : undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="size-9 text-primary" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
        Payment successful
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        {course
          ? `You're now enrolled in ${course.title}. A confirmation email is on its way.`
          : "Your enrollment is confirmed. A confirmation email is on its way."}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/courses">Browse more courses</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
