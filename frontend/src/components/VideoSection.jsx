const logo = "/images/logo.jpeg";
import { useEffect, useState } from "react";
const points = [
  "State-of-the-art steam distillation facility",
  "Cold pressing for delicate carrier oils",
  "In-house GC/MS laboratory testing",
  "ISO & WHO-GMP compliant packaging",
  "Global shipping via DHL, FedEx & cargo",
];

export default function VideoSection() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [modalOpen]);

  return (
    <>
      {/* ── SECTION ── */}
      <section
        style={{ backgroundColor: "var(--color-cream-white)" }}
        className="px-6 py-16 md:py-20"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

          {/* ── LEFT: video thumbnail ── */}
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(62,43,30,0.16)",
              border: "1px solid var(--color-warm-gray)",
            }}
          >
            <img
              src={logo}
              alt="Aromatherapy Manufacturing Process"
              className="w-full h-75 md:h-90 object-cover block"
            />

            {/* overlay + play button */}
            <button
              onClick={() => setModalOpen(true)}
              className="absolute inset-0 flex items-center justify-center transition-colors duration-300"
              style={{ background: "rgba(30,18,10,0.22)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(30,18,10,0.50)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(30,18,10,0.22)")}
              aria-label="Play video"
            >
              <span
                className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
                style={{
                  background: "var(--gradient-btn)",
                  boxShadow: "0 4px 20px rgba(62,43,30,0.40)",
                }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white ml-1">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </span>
            </button>

            {/* tag */}
            <span
              className="absolute top-3 left-3 text-xs font-medium tracking-wide px-3 py-1.5"
              style={{
                background: "rgba(248,245,242,0.92)",
                color: "var(--color-text-muted)",
                borderRadius: 2,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              ▶ Watch: Our Manufacturing Process
            </span>
          </div>

          {/* ── RIGHT: copy ── */}
          <div>
            {/* Eyebrow — matches site-wide pattern */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 24,
                  height: 1.5,
                  background: "linear-gradient(90deg, transparent, var(--color-brown-light))",
                  borderRadius: 2,
                }}
              />
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--color-brown-muted)",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  margin: 0,
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                Watch &amp; Learn
              </p>
              <span
                style={{
                  display: "inline-block",
                  width: 24,
                  height: 1.5,
                  background: "linear-gradient(90deg, var(--color-brown-light), transparent)",
                  borderRadius: 2,
                }}
              />
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: "clamp(24px, 4vw, 40px)",
                fontWeight: 600,
                color: "var(--color-brown-deep)",
                lineHeight: 1.2,
                marginBottom: 16,
                letterSpacing: "0.01em",
              }}
            >
              From Nature to
              <br />
              Your Bottle
            </h2>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.75,
                marginBottom: 24,
                color: "var(--color-text-muted)",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 400,
              }}
            >
              Watch how we source, process, test and package our essential oils
              — from raw botanicals to premium finished products ready for
              global export.
            </p>

            {/* bullet list */}
            <ul style={{ marginBottom: 32, padding: 0, listStyle: "none" }}>
              {points.map((pt, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 0",
                    fontSize: 14,
                    borderBottom: "1px solid var(--color-warm-gray)",
                    color: "var(--color-text-primary)",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: "var(--color-brown-muted)",
                    }}
                  />
                  {pt}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("open-brochure"));
              }}
              style={{
                display: "inline-block",
                padding: "11px 28px",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--color-cream-white)",
                background: "var(--gradient-btn)",
                borderRadius: 2,
                textDecoration: "none",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                boxShadow: "0 2px 10px rgba(92,64,51,0.22)",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Download Company Profile (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* ── VIDEO MODAL ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(17,17,17,0.82)" }}
          onClick={() => setModalOpen(false)}
        >
          <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <video
                className="absolute inset-0 w-full h-full"
                style={{ borderRadius: 2 }}
                src="/images/Comp 1.mp4"
                controls
                autoPlay
                muted
              />
            </div>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: "absolute",
                top: -36,
                right: 0,
                color: "var(--color-brown-light)",
                fontSize: 22,
                background: "none",
                border: "none",
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}