import { useState, useEffect, useRef, Fragment } from "react";
const slides = [
  {
    eyebrow: "OEM & ODM Private Label Solutions",
    headline: ["Manufactured for Scale"],
    accentLine: 2,
    subline: "From Concept to Bulk Supply, Seamlessly",
    certBadges: ["White Label", "Custom Packaging", "Flexible MOQ"],
    description:
      "Launch your own essential oil brand with our complete OEM/ODM solutions — formulation, filling, labelling and global export.",
    stats: [
      { number: "OEM", label: "Ready" },
      { number: "Custom", label: "Formulas" },
      { number: "Global", label: "Shipping" },
    ],
    primaryCta: "Start Private Label",
    secondaryCta: { label: "View Private Label", href: "/private-labelling" },
    badge: "White Label · B2B Bulk Supply",
    image: "/images/slider1.jpeg",
    overlay:
      "linear-gradient(105deg, rgba(26,12,4,0.92) 0%, rgba(26,12,4,0.72) 45%, rgba(26,12,4,0) 100%)",
  },
  {
    eyebrow: "Trusted B2B Manufacturing Partner · 15 Years",
    headline: ["Essential Oils,Carrier Oils,Hydrosols & Mores"],
    accentLine: 2,
    subline: "Certified for Global Export  ·  ISO · WHO-GMP · HACCP · Kosher",
    certBadges: ["ISO", "WHO-GMP", "HACCP", "Kosher"],
    description:
      "100% pure, natural and certified organic essential oils — GC/MS tested and ready for B2B supply to 70+ countries.",
    stats: [
      { number: "500+", label: "Oil Varieties" },
      { number: "70+", label: "Countries" },
      { number: "15K+", label: "B2B Clients" },
      { number: "15", label: "Yrs Exp." },
    ],
    primaryCta: "Request a Quote",
    secondaryCta: { label: "Explore Products", href: "#cat-sec" },
    badge: "Trusted by 15,000+ Global B2B Clients",
    image: "/images/slider2.jpeg",
    overlay:
      "linear-gradient(105deg, rgba(26,12,4,0.90) 0%, rgba(26,12,4,0.68) 45%, rgba(26,12,4,0.0) 100%)",
  },
  {
    eyebrow: "Lab-Tested Excellence",
    headline: ["Purity That Performs Every batch"],
    accentLine: 1,
    subline: "GC-MS · COA · MSDS · Global Compliance",
    certBadges: ["GC-MS Tested", "COA Provided", "MSDS Available"],
    description:
      "Every batch rigorously tested for purity, potency and safety. Full documentation provided for global regulatory compliance.",
    stats: [
      { number: "GC-MS", label: "Testing" },
      { number: "100%", label: "Traceability" },
      { number: "ISO", label: "Certified" },
    ],
    primaryCta: "Request Sample",
    secondaryCta: { label: "Quality Standards", href: "/quality-assurance" },
    badge: "ISO · WHO-GMP · HACCP · Kosher",
    image: "/images/silder3.jpeg",
    overlay:
      "linear-gradient(105deg, rgba(26,12,4,0.88) 0%, rgba(26,12,4,0.65) 45%, rgba(26,12,4,0.0) 100%)",
  },
  {
    eyebrow: "Bulk · Contract · Private Label Manufacturing",
    headline: ["Global Supply Consistent Quality"],
    accentLine: 2,
    subline: "Premium Natural Oils at Scale",
    certBadges: ["Bulk Orders", "Custom Formulas", "Fast Lead Times"],
    description:
      "From small batches to full container loads — we manufacture and supply premium natural oils for brands worldwide.",
    stats: [
      { number: "200+", label: "Oil Types" },
      { number: "MT Scale", label: "Capacity" },
      { number: "48hr", label: "Sample TAT" },
    ],
    primaryCta: "Get Bulk Quote",
    secondaryCta: { label: "Our Capabilities", href: "/wholesale" },
    badge: "Bulk · Contract · Private Label",
    image: "/images/silder4.jpeg",
    overlay:
      "linear-gradient(105deg, rgba(26,12,4,0.90) 0%, rgba(26,12,4,0.68) 45%, rgba(26,12,4,0.0) 100%)",
  },
];

export const Hero = ({ onOpenInquiry }) => {
  // Accept the shared `onOpenInquiry` prop name used across the app
  // (SiteShell / Navbar / HomePage). If it isn't wired for any reason,
  // fall back to the global "open-inquiry" event that FloatingInquiry
  // listens for, so the primary CTA can never become a silent no-op.
  const openInquiry =
    onOpenInquiry ??
    (() => window.dispatchEvent(new CustomEvent("open-inquiry")));

  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
      setAnimKey((k) => k + 1);
    }, 5800);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const moveSlide = (dir) => {
    setCurrent((c) => (c + dir + slides.length) % slides.length);
    setAnimKey((k) => k + 1);
    startTimer();
  };

  const goSlide = (idx) => {
    setCurrent(idx);
    setAnimKey((k) => k + 1);
    startTimer();
  };

  const s = slides[current];

  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        overflow: "hidden",
        height: "calc(100vh - 139px)",
        minHeight: 480,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        /* iOS Safari's address bar makes 100vh taller than what's actually
           visible, cutting the hero off / leaving a gap. dvh reflects the
           real visible viewport and is supported on iOS 15.4+. */
        @supports (height: 100dvh) {
          .hero-section { height: calc(100dvh - 139px) !important; }
        }
        @media (max-width: 768px) {
          .hero-section { height: calc(100vh - 60px) !important; min-height: 560px !important; }
          @supports (height: 100dvh) {
            .hero-section { height: calc(100dvh - 60px) !important; }
          }
        }
      `}</style>
      <style>{`
        /* ── Google Fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap');

        .slide-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .slide-bg-active {
          animation: imgZoom 6.2s ease forwards;
        }
        @keyframes imgZoom {
          from { transform: scale(1.06); opacity: 0; }
          5%   { opacity: 1; }
          to   { transform: scale(1.0); opacity: 1; }
        }
        .slide-bg-inactive { opacity: 0; transition: opacity 0.6s ease; }

        /* ── Slide content fade-up ── */
        .h-fade-up { animation: fadeUp 0.72s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Cert pill: refined brown-gold border matching design system ── */
        .cert-pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 14px;
          border: 0.5px solid rgba(196, 168, 130, 0.60);
          border-radius: 100px;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(196, 168, 130, 0.95);
          background: rgba(196, 168, 130, 0.08);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          transition: background 0.2s, border-color 0.2s;
        }
        .cert-pill:hover {
          background: rgba(196, 168, 130, 0.16);
          border-color: rgba(196, 168, 130, 0.85);
        }

        /* ── CTA: primary gold button ── */
        .btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          background: linear-gradient(135deg, var(--color-brown-light), #c49a6c);
          color: var(--color-brown-deep);
          border: none;
          border-radius: 100px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.25s, transform 0.18s, box-shadow 0.25s;
          box-shadow: 0 4px 20px rgba(196, 168, 130, 0.30);
          white-space: nowrap;
        }
        .btn-gold:hover {
          background: linear-gradient(135deg, #c49a6c, var(--color-brown-light));
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(196, 168, 130, 0.40);
        }
        .btn-gold:active { transform: translateY(0); }

        /* ── CTA: ghost outline button ── */
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: transparent;
          color: rgba(248, 245, 242, 0.90);
          border: 1.5px solid rgba(196, 168, 130, 0.45);
          border-radius: 100px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s;
          text-decoration: none;
          white-space: nowrap;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .btn-ghost:hover {
          background: rgba(196, 168, 130, 0.12);
          border-color: rgba(196, 168, 130, 0.80);
          color: var(--color-cream-white);
          transform: translateY(-2px);
        }

        /* ── Slide navigation arrows ── */
        .nav-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(248, 245, 242, 0.06);
          border: 1px solid rgba(196, 168, 130, 0.30);
          color: var(--color-cream-white);
          font-size: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.22s;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          position: absolute;
          z-index: 20;
        }
        .nav-btn:hover {
          background: rgba(196, 168, 130, 0.22);
          border-color: rgba(196, 168, 130, 0.75);
          transform: scale(1.06);
        }

        @media (min-width: 769px) {
          .nav-btn { bottom: 80px; top: auto; transform: none; }
          .nav-btn:hover { transform: scale(1.06); }
          .nav-btn-prev { left: 18px; }
          .nav-btn-next { right: 18px; }
        }

        @media (max-width: 768px) {
          .nav-btn {
            top: auto;
            bottom: 54px;
            transform: none;
            width: 38px; height: 38px;
            font-size: 18px;
          }
          .nav-btn-prev { left: auto; right: 68px; }
          .nav-btn-next { right: 18px; }
        }

        /* ── Progress dots ── */
        .dot {
          height: 5px;
          width: 5px;
          border-radius: 3px;
          border: 1px solid rgba(196, 168, 130, 0.60);
          background: transparent;
          cursor: pointer;
          transition: all 0.38s cubic-bezier(0.22,1,0.36,1);
          padding: 0;
        }
        .dot.on {
          width: 30px;
          background: linear-gradient(90deg, var(--color-brown-light), #c49a6c);
          border-color: var(--color-brown-light);
          box-shadow: 0 0 8px rgba(196,168,130,0.35);
        }

        /* ── Stat dividers ── */
        .stat-sep {
          width: 1px;
          height: 36px;
          background: rgba(196, 168, 130, 0.22);
          align-self: center;
          flex-shrink: 0;
        }

        /* ── Progress bar ── */
        .progress-track {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255,255,255,0.06);
          z-index: 30;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-brown-light), #c49a6c);
          animation: prog 5.8s linear forwards;
        }
        @keyframes prog { from { width: 0% } to { width: 100% } }

        /* ── Mobile overrides ── */
        @media (max-width: 768px) {
          .hero-inner {
            padding: 1.5rem 1.5rem 7rem !important;
            justify-content: flex-end !important;
            max-width: 100% !important;
          }
          .hero-desc { display: none !important; }
          .stat-sep { display: none !important; }
          .hero-stats { gap: 14px !important; }
          .hero-badge { display: none !important; }

          .hero-dots {
            bottom: 28px !important;
            left: 1.5rem !important;
          }

          .hero-ctas {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          .btn-gold, .btn-ghost {
            width: 100%;
            justify-content: center;
          }
        }

        @media (min-width: 769px) and (max-width: 1100px) {
          .hero-inner { max-width: 58% !important; }
        }
      `}</style>

      {/* Background images */}
      {slides.map((slide, idx) => (
        <img
          key={idx}
          src={slide.image}
          alt=""
          className={`slide-bg ${idx === current ? "slide-bg-active" : "slide-bg-inactive"}`}
          style={{ zIndex: idx === current ? 1 : 0 }}
        />
      ))}

      {/* Directional overlay */}
      <div
        key={`ov-${current}`}
        style={{
          position: "absolute",
          inset: 0,
          background: s.overlay,
          zIndex: 2,
          transition: "background 0.5s ease",
        }}
      />

      {/* Bottom vignette — uses deep brown from design system */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 180,
          background:
            "linear-gradient(to top, rgba(26,12,4,0.72) 0%, rgba(26,12,4,0.30) 60%, transparent 100%)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* Left-edge shimmer accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 3,
          background:
            "linear-gradient(180deg, transparent 0%, var(--color-brown-light) 40%, var(--color-brown-muted) 70%, transparent 100%)",
          zIndex: 15,
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        className="hero-inner"
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(1.5rem, 5vw, 4rem) clamp(1.5rem, 7vw, 6rem)",
          width: "100%",
        }}
      >
        <div key={animKey} className="h-fade-up">
          {/* Eyebrow line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 22,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 32,
                height: 1.5,
                background:
                  "linear-gradient(90deg, var(--color-brown-light), transparent)",
                borderRadius: 2,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "var(--color-brown-light)",
              }}
            >
              {s.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-hl"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(1.9rem, 8vw, 2.7rem)",
              fontWeight: 600,
              lineHeight: 1.05,
              color: "var(--color-cream-white)",
              margin: "0 0 14px",
              letterSpacing: "-0.01em",
              wordBreak: "break-word",
              textShadow: "0 2px 20px rgba(0,0,0,0.25)",
            }}
          >
            {s.headline.map((line, i) =>
              i === s.accentLine ? (
                <span key={i} style={{ display: "block" }}>
                  <em
                    style={{
                      fontStyle: "italic",
                      color: "var(--color-brown-light)",
                      fontWeight: 400,
                    }}
                  >
                    {line}
                  </em>
                </span>
              ) : (
                <span key={i} style={{ display: "block" }}>
                  {line}
                </span>
              ),
            )}
          </h1>

          {/* Subline */}
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.18em",
              color: "rgba(196, 168, 130, 0.80)",
              margin: "0 0 18px",
              textTransform: "uppercase",
            }}
          >
            {s.subline}
          </p>

          {/* Cert pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 22,
            }}
          >
            {s.certBadges.map((b) => (
              <span key={b} className="cert-pill">
                {b}
              </span>
            ))}
          </div>

          {/* Description */}
          <p
            className="hero-desc"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 14,
              fontWeight: 300,
              color: "rgba(248, 245, 242, 0.70)",
              lineHeight: 1.9,
              margin: "0 0 28px",
              maxWidth: 560,
              letterSpacing: "0.01em",
            }}
          >
            {s.description}
          </p>

          {/* Stats */}
          <div
            className="hero-stats"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              alignItems: "flex-start",
              marginBottom: 32,
            }}
          >
            {s.stats.map((st, i) => (
              <Fragment key={st.label}>
                <div>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "2.2rem",
                      fontWeight: 700,
                      color: "var(--color-cream-white)",
                      lineHeight: 1,
                      textShadow: "0 1px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    {st.number}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--color-brown-light)",
                      marginTop: 5,
                    }}
                  >
                    {st.label}
                  </span>
                </div>
                {i < s.stats.length - 1 && (
                  <div className="stat-sep" />
                )}
              </Fragment>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="hero-ctas"
            style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
          >
            <button className="btn-gold" onClick={openInquiry}>
              {s.primaryCta}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M2 6.5h9M8 3l3.5 3.5L8 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <a className="btn-ghost" href={s.secondaryCta.href}>
              {s.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom-right badge */}
      <div
        className="hero-badge"
        style={{
          position: "absolute",
          bottom: 28,
          right: "clamp(1.5rem, 6vw, 4rem)",
          zIndex: 15,
          background: "rgba(26,12,4,0.55)",
          border: "1px solid rgba(196, 168, 130, 0.35)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: 100,
          padding: "8px 20px",
          fontFamily: "'Jost', sans-serif",
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.20em",
          textTransform: "uppercase",
          color: "rgba(196, 168, 130, 0.92)",
          whiteSpace: "nowrap",
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
        }}
      >
        {s.badge}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => moveSlide(-1)}
        className="nav-btn nav-btn-prev"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={() => moveSlide(1)}
        className="nav-btn nav-btn-next"
        aria-label="Next"
      >
        ›
      </button>

      {/* Dots + counter */}
      <div
        className="hero-dots"
        style={{
          position: "absolute",
          bottom: 32,
          left: "clamp(1.5rem, 7vw, 6rem)",
          display: "flex",
          alignItems: "center",
          gap: 7,
          zIndex: 20,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goSlide(i)}
            className={`dot ${i === current ? "on" : ""}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
        <span
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 10,
            fontWeight: 400,
            color: "rgba(196, 168, 130, 0.55)",
            marginLeft: 8,
            letterSpacing: "0.12em",
          }}
        >
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-track">
        <div key={`p-${animKey}`} className="progress-fill" />
      </div>
    </section>
  );
};

export default Hero;
