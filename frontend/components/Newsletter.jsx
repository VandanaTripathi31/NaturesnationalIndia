import { useState } from "react";
import { Sparkles } from "lucide-react";

/* ── Design Tokens — mapped to index.css variables ─────────── */
const DS = {
  cream: "var(--color-cream-white)", // #f8f5f2
  offWhite: "var(--color-off-white)", // #faf8f5
  brownDeep: "var(--color-brown-deep)", // #3e2b1e
  brownMid: "var(--color-brown-mid)", // #7a5544
  brownLight: "var(--color-brown-light)", // #c4a882
  brownMuted: "var(--color-brown-muted)", // #a8896c
  darkBrown: "var(--color-dark-brown)", // #5c4033
  coffee: "var(--color-coffee-brown)", // #6f4e37
  textPri: "var(--color-text-primary)", // #1a0f0a
  textMut: "var(--color-text-muted)", // #6b5a4e
  warmGray: "var(--color-warm-gray)", // #d6d0ca
  softGray: "var(--color-soft-gray)", // #e5e5e5
  btnGrad: "var(--gradient-btn)",
  btnHov: "var(--gradient-btn-hover)",
};

const T = {
  display: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  body: "'DM Sans', 'Lato', system-ui, sans-serif",
};

/* ── Component ─────────────────────────────────────────────── */
export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  const handleSubscribe = () => {
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <section
      style={{
        width: "100%",
        padding: "48px 60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "40px",
        flexWrap: "wrap",
        background: "var(--color-off-white)",
        borderTop: `1px solid var(--color-warm-gray)`,
        borderBottom: `1px solid var(--color-warm-gray)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot-pattern decoration — right side, using warm gray tone */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "280px",
          backgroundImage: `radial-gradient(circle, var(--color-warm-gray) 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />

      {/* Left accent line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "15%",
          bottom: "15%",
          width: "3px",
          background:
            "linear-gradient(180deg, transparent, var(--color-brown-light), transparent)",
          opacity: 0.45,
          borderRadius: "0 2px 2px 0",
          pointerEvents: "none",
        }}
      />

      {/* ── Text ── */}
      <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
        {/* Label row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <Sparkles size={14} style={{ color: "var(--color-brown-muted)" }} />
          <span
            style={{
              fontFamily: T.body,
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "var(--color-brown-muted)",
            }}
          >
            B2B Newsletter
          </span>
        </div>

        <h3
          style={{
            fontFamily: T.display,
            fontSize: "clamp(20px, 3vw, 26px)",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            marginBottom: "10px",
            lineHeight: "1.35",
            letterSpacing: "0.1px",
          }}
        >
          Stay Updated with Industry Insights
        </h3>

        <p
          style={{
            fontFamily: T.body,
            fontSize: "14px",
            color: "var(--color-text-muted)",
            lineHeight: "1.75",
            maxWidth: "360px",
            fontWeight: 400,
          }}
        >
          New products, pricing updates and exclusive B2B offers — monthly
          newsletter.
        </p>
      </div>

      {/* ── Form ── */}
      <div
        style={{
          maxWidth: "400px",
          minWidth: "240px",
          flex: 1,
          position: "relative",
        }}
      >
        {submitted ? (
          /* Success state — uses sage tones from design system */
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 20px",
              background: "var(--color-sage-light)",
              border: `1px solid rgba(74,107,70,0.22)`,
              borderRadius: "6px",
              fontFamily: T.body,
              fontSize: "13.5px",
              color: "var(--color-sage-dark)",
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: "15px" }}>✓</span>
            You're subscribed! Welcome aboard.
          </div>
        ) : (
          <>
            {/* Input row */}
            <div
              style={{
                display: "flex",
                borderRadius: "4px",
                boxShadow: focused
                  ? "0 0 0 3px rgba(196,168,130,0.18)"
                  : "0 1px 4px rgba(62,43,30,0.08)",
                transition: "box-shadow 0.2s",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="Your business email address"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                  flex: 1,
                  outline: "none",
                  padding: "12px 16px",
                  color: "var(--color-text-primary)",
                  background: "#FFFFFF",
                  border: `1.5px solid ${focused ? "var(--color-brown-light)" : "var(--color-warm-gray)"}`,
                  borderRight: "none",
                  borderRadius: "4px 0 0 4px",
                  fontFamily: T.body,
                  fontSize: "13px",
                  transition: "border-color 0.2s",
                }}
              />
              <button
                onClick={handleSubscribe}
                onMouseEnter={() => setBtnHov(true)}
                onMouseLeave={() => setBtnHov(false)}
                style={{
                  padding: "12px 24px",
                  background: btnHov ? DS.btnHov : DS.btnGrad,
                  color: "var(--color-cream-white)",
                  fontFamily: T.body,
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                  border: "none",
                  borderRadius: "0 4px 4px 0",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 0.22s",
                  transform: btnHov ? "translateY(-1px)" : "none",
                  boxShadow: btnHov
                    ? "0 4px 14px rgba(92,64,51,0.35)"
                    : "0 2px 8px rgba(92,64,51,0.22)",
                }}
              >
                Subscribe
              </button>
            </div>

            <p
              style={{
                fontSize: "11px",
                color: "var(--color-brown-muted)",
                opacity: 0.7,
                marginTop: "9px",
                fontFamily: T.body,
                letterSpacing: "0.1px",
              }}
            >
              No spam, ever. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
