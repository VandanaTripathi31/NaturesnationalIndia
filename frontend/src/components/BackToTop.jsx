"use client";

import { useEffect, useState } from "react";

/*
  Floating "back to top" button, bottom-right corner.

  NOTE: InquiryWidget.jsx already places its floating "Get Free Quote"
  button at bottom: 28px / right: 28px (58px circle). To avoid the two
  overlapping, this one sits directly above it (bottom: 98px).
  Drop <BackToTop /> once near the root layout, alongside <Navbar /> /
  <InquiryWidget /> / <Footer />.
*/
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Back to top"
      title="Back to top"
      style={{
        position: "fixed",
        bottom: "98px",
        right: "28px",
        zIndex: 1900,
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        backgroundColor: hovered
          ? "var(--color-brown-mid, #A67B5B)"
          : "var(--color-cream-white, #FFF9F2)",
        border: "1px solid var(--color-brown-light, #D4B896)",
        boxShadow: hovered
          ? "0 8px 22px rgba(92,64,51,0.32)"
          : "0 4px 14px rgba(92,64,51,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition:
          "opacity 0.3s ease, transform 0.3s ease, background 0.2s, box-shadow 0.2s",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke={hovered ? "#fff" : "var(--color-brown-mid, #A67B5B)"}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "stroke 0.2s" }}
      >
        <path d="M8 13V3M3 7l5-5 5 5" />
      </svg>
    </button>
  );
}
