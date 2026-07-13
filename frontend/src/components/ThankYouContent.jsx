"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

/*
  Place this file at: src/components/ThankYouContent.jsx

  Used by app/thank-you/page.js (Next.js App Router).

  IMPORTANT: This is a Next.js project, not React Router.
  - Use `next/link` instead of `react-router-dom`'s Link
  - Use `useSearchParams` from `next/navigation`, not `react-router-dom`
  - Any component that calls useSearchParams() must be rendered inside
    a <Suspense> boundary during static export/prerendering, otherwise
    Next.js throws a prerender error on `next build`.

  Your InquiryWidget.jsx should redirect with Next's router:
    import { useRouter } from "next/navigation";
    const router = useRouter();
    router.push(`/thank-you?name=${encodeURIComponent(name)}`);
*/

function ThankYouInner() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        background: "var(--color-cream-white, #FFF9F2)",
        fontFamily: "'DM Sans', 'Outfit', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>

        <h1
          style={{
            fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
            fontSize: 30,
            color: "var(--color-text-primary, #3E2C23)",
            fontWeight: 500,
            marginBottom: 14,
          }}
        >
          Thank You{name ? `, ${name}` : ""}!
        </h1>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--color-text-muted, #6B5A4E)",
            marginBottom: 32,
          }}
        >
          Your inquiry has been received. Our export team will review your
          requirements and get back to you within 24 hours with pricing and
          samples.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg, #5C3D2E 0%, #8B6344 100%)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: 100,
              padding: "12px 28px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Back to Home
          </Link>
          <a
            href="tel:+919711003901"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid var(--color-brown-light, #D4B896)",
              color: "var(--color-text-primary, #3E2C23)",
              textDecoration: "none",
              borderRadius: 100,
              padding: "12px 28px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            📞 Call Us
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouContent() {
  return (
    <Suspense fallback={null}>
      <ThankYouInner />
    </Suspense>
  );
}
