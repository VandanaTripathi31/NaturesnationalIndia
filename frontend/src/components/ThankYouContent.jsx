"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Phone, Mail, ArrowRight } from "lucide-react";
import FadeIn from "./FadeIn";

/*
  Place this file at: src/components/ThankYouContent.jsx
  Used by app/thank-you/page.jsx (Next.js App Router).

  This page is reached after a successful "Send Enquiry" submission from
  either the site-wide floating InquiryWidget (src/components/FloatingInquiry.jsx)
  or the Contact Us form (src/views/ContactUs.jsx), both of which redirect
  here via next/navigation's router.push("/thank-you"). The submitted
  details are passed through sessionStorage (never query params) so the URL
  stays exactly /thank-you while we still show a real confirmation summary.

  IMPORTANT: This is a Next.js project, not React Router.
  - Use `next/link` instead of `react-router-dom`'s Link
  - Use `useSearchParams` from `next/navigation`, not `react-router-dom`
  - Any component that calls useSearchParams() must be rendered inside
    a <Suspense> boundary during static export/prerendering, otherwise
    Next.js throws a prerender error on `next build`.
*/

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-[#ede8e3] last:border-b-0">
      <span className="text-[11px] font-bold tracking-widest uppercase text-[#7a5544]">
        {label}
      </span>
      <span className="text-sm text-[#3e2b1e] font-medium text-right break-all">
        {value}
      </span>
    </div>
  );
}

function ThankYouInner() {
  const router = useRouter();

  // Both enquiry forms stash the submitted details in sessionStorage and
  // set a success flag before navigating here, so this page's URL stays
  // exactly /thank-you — no personal data in the address bar, history or
  // referrer. A bare, direct open of /thank-you (no flag) is bounced back
  // to the homepage so a failed/abandoned submission can't register a
  // conversion.
  const [allowed, setAllowed] = useState(false);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    let flag = null;
    let stored = null;
    try {
      flag = sessionStorage.getItem("nn-enquiry-success");
      stored = sessionStorage.getItem("nn-enquiry-details");
    } catch {
      /* storage unavailable — fall through to redirect */
    }
    if (!flag) {
      router.replace("/");
      return;
    }
    if (stored) {
      try {
        setDetails(JSON.parse(stored));
      } catch {
        /* malformed — show the generic confirmation instead */
      }
    }
    setAllowed(true);
  }, [router]);

  const name = details?.name ?? null;
  const email = details?.email ?? null;
  const phone = details?.phone ?? null;
  const category = details?.category ?? null;
  const quantity = details?.quantity ?? null;
  const hasDetails = Boolean(name || email || phone || category || quantity);

  if (!allowed) return <ThankYouFallback />;

  return (
    <div
      className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-20"
      style={{ background: "var(--color-cream-white, #f8f5f2)" }}
    >
      <div className="max-w-xl w-full">
        <FadeIn>
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "var(--color-sage-light, #ebf0e8)" }}
            >
              <CheckCircle2
                size={30}
                strokeWidth={2}
                style={{ color: "var(--color-sage-dark, #4a6b46)" }}
              />
            </div>

            <h1
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-3xl sm:text-4xl font-semibold text-[#3e2b1e] mb-3"
            >
              Thank You{name ? `, ${name}` : ""}!
            </h1>

            <p className="text-[#6b5a4e] text-base leading-relaxed max-w-md mx-auto">
              Your enquiry has been received. Our export team will review
              your requirements and get back to you within 24 hours with
              pricing and samples.
            </p>
          </div>
        </FadeIn>

        {hasDetails && (
          <FadeIn delay={100}>
            <div className="bg-white border border-[#ede8e3] rounded-3xl p-6 sm:p-7 mb-8">
              <div className="text-[11px] font-bold tracking-widest uppercase text-[#a8896c] mb-1">
                Enquiry Confirmation
              </div>
              <div className="mt-2">
                <DetailRow label="Name" value={name} />
                <DetailRow label="Email" value={email} />
                <DetailRow label="Phone" value={phone} />
                <DetailRow label="Product Interest" value={category} />
                <DetailRow label="Quantity" value={quantity} />
              </div>
            </div>
          </FadeIn>
        )}

        <FadeIn delay={150}>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Link href="/" className="btn-primary">
              Back to Home
              <ArrowRight size={15} />
            </Link>
            <a href="tel:+919711003901" className="btn-secondary">
              <Phone size={14} />
              Call Us
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#a8896c]">
            <a
              href="tel:+919711003901"
              className="inline-flex items-center gap-1.5 hover:text-[#7a5544] transition-colors"
            >
              <Phone size={13} /> +91 9711003901
            </a>
            <a
              href="mailto:info@naturesnaturalindia.com"
              className="inline-flex items-center gap-1.5 hover:text-[#7a5544] transition-colors"
            >
              <Mail size={13} /> info@naturesnaturalindia.com
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

function ThankYouFallback() {
  return (
    <div
      className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-20"
      style={{ background: "var(--color-cream-white, #f8f5f2)" }}
    >
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{
          borderColor: "rgba(196,168,130,0.3)",
          borderTopColor: "var(--color-dark-brown, #5c4033)",
        }}
      />
    </div>
  );
}

export default function ThankYouContent() {
  return (
    <Suspense fallback={<ThankYouFallback />}>
      <ThankYouInner />
    </Suspense>
  );
}
