import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { VerifyForm } from "@/features/certificates/components/verify-form";

export const metadata: Metadata = {
  title: "Verify a Certificate",
  description: "Check the authenticity of a Pixel Perfect Films Institute certificate by ID.",
};

export default function VerifyLandingPage() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="size-7 text-primary" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
          Verify a certificate
        </h1>
        <p className="mt-3 text-muted-foreground">
          Enter a certificate ID to confirm it was genuinely issued by Pixel Perfect Films
          Institute.
        </p>
        <div className="mt-8">
          <VerifyForm />
        </div>
      </div>
    </div>
  );
}
