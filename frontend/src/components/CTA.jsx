import { useState } from "react";
import { Leaf } from "lucide-react";

/* ── Design Tokens — mapped to index.css variables ─────────── */
const DS = {
  cream: "var(--color-cream-white)",
  offWhite: "var(--color-off-white)",
  brownDeep: "var(--color-brown-deep)",
  brownMid: "var(--color-brown-mid)",
  brownLight: "var(--color-brown-light)",
  brownMuted: "var(--color-brown-muted)",
  darkBrown: "var(--color-dark-brown)",
  coffee: "var(--color-coffee-brown)",
};

const T = {
  display: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  body: "'DM Sans', 'Lato', system-ui, sans-serif",
};

/* ── Shared: OutlineButton ─────────────────────────────────── */
function OutlineButton({ children, onClick, light = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: hovered
          ? light
            ? "rgba(248,245,242,0.12)"
            : "rgba(196,168,130,0.08)"
          : "transparent",
        color: light ? "var(--color-cream-white)" : "var(--color-dark-brown)",
        border: `1.5px solid ${
          light
            ? hovered
              ? "rgba(248,245,242,0.75)"
              : "rgba(248,245,242,0.45)"
            : hovered
              ? "var(--color-brown-light)"
              : "var(--color-brown-light)"
        }`,
        borderRadius: "4px",
        padding: "11px 22px",
        fontFamily: T.body,
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: "0.3px",
        cursor: "pointer",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      {children}
    </button>
  );
}

/* ── Component ─────────────────────────────────────────────── */
export default function CTASection({ onInquiryOpen }) {
  const [callHovered, setCallHovered] = useState(false);
  const openInquiry = () =>
    onInquiryOpen
      ? onInquiryOpen()
      : window.dispatchEvent(new CustomEvent("open-inquiry"));

  return (
    <section
      style={{
        width: "100%",
        padding: "56px 60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        flexWrap: "wrap",
        background: "var(--gradient-hero)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top hairline — premium accent border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "8%",
          right: "8%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, var(--color-brown-light), transparent)",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />

      {/* Radial glow overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 78% 50%, rgba(196,168,130,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Decorative concentric rings — now using brown-light tones */}
      <div
        style={{
          position: "absolute",
          right: "180px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          border: "1px solid rgba(196,168,130,0.08)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "140px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          border: "1px solid rgba(196,168,130,0.05)",
          pointerEvents: "none",
        }}
      />

      {/* ── Text ── */}
      <div style={{ flex: 1, minWidth: "280px", position: "relative" }}>
        {/* Premium label badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
            padding: "5px 14px 5px 10px",
            background: "rgba(196,168,130,0.10)",
            border: "1px solid rgba(196,168,130,0.25)",
            borderRadius: "100px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--color-brown-light)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: T.body,
              fontSize: "9.5px",
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "var(--color-brown-light)",
            }}
          >
            Global B2B Export
          </span>
        </div>

        <h2
          style={{
            fontFamily: T.display,
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 600,
            color: "var(--color-cream-white)",
            marginBottom: "12px",
            lineHeight: "1.3",
            letterSpacing: "0.2px",
          }}
        >
          Ready to Source Premium Essential Oils?
        </h2>

        <p
          style={{
            fontFamily: T.body,
            fontSize: "14px",
            color: "rgba(248,245,242,0.72)",
            lineHeight: "1.75",
            maxWidth: "420px",
            fontWeight: 300,
          }}
        >
          Free samples, competitive bulk pricing and full documentation — speak
          with our export team today.
        </p>
      </div>

      {/* ── Actions ── */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* Call button — cream on dark bg */}
        <a
          href="tel:+919711003901"
          onMouseEnter={() => setCallHovered(true)}
          onMouseLeave={() => setCallHovered(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: callHovered
              ? "var(--color-off-white)"
              : "var(--color-cream-white)",
            color: "var(--color-dark-brown)",
            borderRadius: "4px",
            padding: "12px 24px",
            fontFamily: T.body,
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.22s",
            boxShadow: callHovered
              ? "0 6px 20px rgba(0,0,0,0.18)"
              : "0 2px 10px rgba(0,0,0,0.12)",
            transform: callHovered ? "translateY(-2px)" : "translateY(0)",
            letterSpacing: "0.3px",
          }}
        >
          📞 Call Us Now
        </a>

        <OutlineButton onClick={openInquiry} light>
          ✉ Send Inquiry
        </OutlineButton>
      </div>
    </section>
  );
}
