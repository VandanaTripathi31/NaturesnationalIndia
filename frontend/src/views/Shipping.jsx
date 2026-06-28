import { useState } from "react";

const T = {
  brownDeep: "#3e2b1e",
  brownMid: "#7a5544",
  brownLight: "#c4a882",
  brownMuted: "#a8896c",
  coffee: "#6f4e37",
  offWhite: "#faf8f5",
  cream: "#f8f5f2",
  warmGray: "#e7e1d9",
  textPrimary: "#241710",
  textMuted: "#7a6a5d",
  sageLight: "#ebf0e8",
  sageDark: "#4a6b46",
  gold: "#d4af7a",
  gradWarm: "linear-gradient(135deg, #fff9f2 0%, #f8f0e6 50%, #f1e4d4 100%)",
  gradGold: "linear-gradient(135deg, #c4a882 0%, #d4af7a 60%, #e8cfa5 100%)",
};

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const shippingImages = [
  "/images/cargoship.jpeg",
  "/images/Bulk Supply.jpeg",
  "/images/Bulk Supply.jpeg",
  "/images/DHL.jpg",
  "/images/Bulk Supply.jpeg",
  "/images/Bulk Supply.jpeg",
  "/images/Bulk Supply.jpeg",
  "/images/Bulk Supply.jpeg",
];
const CARRIERS = [
  {
    id: "dhl",
    name: "DHL Express",
    accent: "#FFCC00",
    img: "/images/DHL.jpg",
    transit: "2–5 Business Days",
    tracking: "Real-time GPS Tracking",
    best: "Time-Critical Shipments",
    features: [
      "Door-to-door delivery",
      "Customs clearance support",
      "Live tracking portal",
      "Priority handling",
    ],
  },
  {
    id: "fedex",
    name: "FedEx International",
    accent: "#4D148C",
    img: "/images/FEDEX.jpg",
    transit: "3–7 Business Days",
    tracking: "Full Shipment Visibility",
    best: "Retail & B2B Orders",
    features: [
      "Flexible service tiers",
      "Signature confirmation",
      "Hazmat-certified handling",
      "B2B account rates",
    ],
  },
  {
    id: "ups",
    name: "UPS Worldwide",
    accent: "#FFB500",
    img: "/images/UPS.jpeg",
    transit: "3–6 Business Days",
    tracking: "End-to-End Tracking",
    best: "Bulk & Wholesale Orders",
    features: [
      "Bulk pallet shipping",
      "Insurance coverage",
      "ADR / IATA compliance",
      "Dedicated account manager",
    ],
  },
  {
    id: "air",
    name: "Air Freight",
    accent: "#5B8AC6",
    img: "/images/Air.jpg",
    transit: "5–10 Business Days",
    tracking: "AWB Tracking",
    best: "Large Volume Cargo",
    features: [
      "Pallet & drum shipments",
      "Temperature-controlled holds",
      "Prepaid customs brokerage",
      "Consolidated cargo options",
    ],
  },
  {
    id: "sea",
    name: "Sea / Ocean Freight",
    accent: "#2E7D6B",
    img: "/images/ocean.jpg",
    transit: "20–35 Business Days",
    tracking: "BL Tracking",
    best: "Bulk Commercial Orders",
    features: [
      "FCL & LCL options",
      "20ft / 40ft containers",
      "Port-to-port or door delivery",
      "Lowest cost per kg",
    ],
  },
];

const COUNTRIES = [
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "UAE",
  "Singapore",
  "South Africa",
  "Netherlands",
  "Italy",
  "Spain",
  "New Zealand",
  "Brazil",
  "Japan",
  "South Korea",
  "China",
  "Mexico",
  "Malaysia",
  "Indonesia",
  "Saudi Arabia",
  "Qatar",
  "Turkey",
  "Thailand",
  "Bangladesh",
  "Sri Lanka",
  "Kenya",
  "Nigeria",
  "Philippines",
  "Vietnam",
];

const STEPS = [
  {
    num: "01",
    icon: "📋",
    title: "Order Placed",
    sub: "Day 0",
    desc: "Your order is confirmed and our team begins quality verification and documentation right away.",
  },
  {
    num: "02",
    icon: "🔬",
    title: "Quality Check",
    sub: "Day 1",
    desc: "Every batch undergoes GC-MS testing and COA issuance before packaging begins.",
  },
  {
    num: "03",
    icon: "📦",
    title: "Expert Packaging",
    sub: "Day 1–2",
    desc: "UN-certified containers, secondary containment, and tamper-evident sealing for every cargo profile.",
  },
  {
    num: "04",
    icon: "📄",
    title: "Documentation",
    sub: "Day 2",
    desc: "Commercial invoice, packing list, COA, MSDS, and country-specific declarations — all pre-cleared.",
  },
  {
    num: "05",
    icon: "✈️",
    title: "Dispatched",
    sub: "Day 2–3",
    desc: "Handed to your chosen carrier. Tracking details sent to your email and WhatsApp within 2 hours.",
  },
  {
    num: "06",
    icon: "🌍",
    title: "Delivered",
    sub: "Day 4–35",
    desc: "Express courier: 4–7 days. Air freight: 7–12 days. Sea freight: 20–35 days.",
  },
];

const TRUST = [
  {
    icon: "🛡️",
    title: "Fully Insured Shipping",
    desc: "Every shipment is fully insured. We take complete responsibility for any loss, damage, or delay in transit.",
  },
  {
    icon: "🌐",
    title: "Global Delivery Network",
    desc: "Reliable delivery across 120+ countries via DHL, FedEx, UPS, air and ocean freight.",
  },
  {
    icon: "⚡",
    title: "Fast Processing",
    desc: "Orders processed within 24 hours, with tracking details sent within 48 hours of dispatch.",
  },
  {
    icon: "🎁",
    title: "Custom Packaging",
    desc: "UN-certified, IATA-compliant packaging tailored to sample, retail, or bulk commercial orders.",
  },
];

const PACKAGING = [
  {
    icon: "🧴",
    title: "Small Retail Orders",
    range: "10ml – 500ml",
    desc: "Amber glass or HDPE bottles, bubble wrap, and DHL-rated outer cartons. Every bottle sealed with Parafilm.",
  },
  {
    icon: "🥁",
    title: "Mid-Bulk Orders",
    range: "1L – 25L",
    desc: "UN-certified aluminium or HDPE canisters, nitrogen-flushed and sealed inside foam-lined outer drums.",
  },
  {
    icon: "🛢️",
    title: "Commercial Bulk",
    range: "50L – 1000L",
    desc: "Steel/HDPE drums, IBC totes, or flexitanks for ocean freight — all UN-marked and hazmat labelled.",
  },
];

const FAQS = [
  {
    q: "What is your order processing time?",
    a: "All orders are processed within 24 hours of payment confirmation. You receive dispatch notification and tracking details within 48 hours.",
  },
  {
    q: "Do you handle customs clearance?",
    a: "We handle all export documentation and customs clearance on our end. Import duties and local taxes in the destination country are the buyer's responsibility.",
  },
  {
    q: "Are shipments insured?",
    a: "Yes. All shipments are fully insured. Natures Natural India is responsible for any loss, damage, or delay during transit.",
  },
  {
    q: "Can I arrange my own shipping?",
    a: "Absolutely. If you prefer your own freight forwarder or courier account, share the details and we will book under your arrangement.",
  },
  {
    q: "How are shipping charges calculated?",
    a: "Shipping costs are based on product weight and volume. We offer highly discounted rates and never treat shipping as a profit center.",
  },
  {
    q: "Do you ship samples internationally?",
    a: "Yes. Sample shipments (up to 500g per SKU) are dispatched via DHL Express or FedEx International Economy, billed at cost price.",
  },
  {
    q: "Can I get a shipping quote before placing an order?",
    a: "Yes. Email exports@naturesnationalindia.com with your product list, quantities, and destination for a freight comparison within 24 hours.",
  },
];

/* ─────────────────────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────────────────────── */
function TrustCard({ item }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "32px 26px",
        border: `1px solid ${T.warmGray}`,
        boxShadow: hover
          ? "0 18px 40px rgba(196,168,130,0.25)"
          : "0 4px 18px rgba(94,64,51,0.06)",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: T.gradGold,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.6rem",
          marginBottom: "18px",
          boxShadow: "0 8px 20px rgba(196,168,130,0.35)",
        }}
      >
        {item.icon}
      </div>
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.1rem",
          fontWeight: 700,
          color: T.brownDeep,
          marginBottom: "8px",
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          color: T.textMuted,
          fontSize: "0.88rem",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {item.desc}
      </p>
    </div>
  );
}

function CarrierCard({ c }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff",
        borderRadius: "22px",
        overflow: "hidden",
        border: `1px solid ${T.warmGray}`,
        boxShadow: hover
          ? "0 20px 48px rgba(94,64,51,0.16)"
          : "0 6px 22px rgba(94,64,51,0.06)",
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        transition: "all 0.32s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{ position: "relative", height: "150px", overflow: "hidden" }}
      >
        <img
          src={c.img}
          alt={c.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hover ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.5s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(36,23,16,0.55), transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "18px",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "#fff",
          }}
        >
          {c.name}
        </div>
      </div>
      <div
        style={{
          padding: "22px 22px 26px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            alignItems: "center",
            gap: "6px",
            background: T.sageLight,
            color: T.sageDark,
            fontSize: "0.72rem",
            fontWeight: 600,
            padding: "4px 12px",
            borderRadius: "999px",
            marginBottom: "14px",
          }}
        >
          ★ Best for: {c.best}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "9px",
            marginBottom: "16px",
          }}
        >
          {c.features.map((f) => (
            <div
              key={f}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <span
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: T.gradGold,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4l2.5 3L9 1"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span style={{ fontSize: "0.85rem", color: T.textPrimary }}>
                {f}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: "auto",
            fontSize: "0.78rem",
            color: T.textMuted,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          📡 {c.tracking}
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ step, last }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        minWidth: "150px",
        position: "relative",
      }}
    >
      {!last && (
        <div
          style={{
            position: "absolute",
            top: "34px",
            left: "calc(50% + 40px)",
            width: "calc(100% - 80px)",
            height: "2px",
            background: `repeating-linear-gradient(90deg, ${T.brownLight} 0 8px, transparent 8px 16px)`,
            zIndex: 0,
          }}
        />
      )}
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: "68px",
          height: "68px",
          borderRadius: "50%",
          background: hover ? T.gradGold : "#fff",
          border: `2px solid ${T.brownLight}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.7rem",
          zIndex: 1,
          boxShadow: hover
            ? "0 12px 28px rgba(196,168,130,0.4)"
            : "0 4px 14px rgba(94,64,51,0.08)",
          transform: hover
            ? "translateY(-4px) scale(1.06)"
            : "translateY(0) scale(1)",
          transition: "all 0.28s ease",
        }}
      >
        {step.icon}
      </div>
      <div
        style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          color: T.gold,
          letterSpacing: "0.1em",
          marginTop: "14px",
        }}
      >
        STEP {step.num} · {step.sub}
      </div>
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: "1rem",
          color: T.brownDeep,
          marginTop: "4px",
          textAlign: "center",
        }}
      >
        {step.title}
      </div>
      <p
        style={{
          color: T.textMuted,
          fontSize: "0.8rem",
          lineHeight: 1.6,
          textAlign: "center",
          marginTop: "8px",
          maxWidth: "190px",
        }}
      >
        {step.desc}
      </p>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderRadius: "18px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.55)",
        border: `1px solid ${open ? T.brownLight : "rgba(196,168,130,0.25)"}`,
        backdropFilter: "blur(10px)",
        boxShadow: open
          ? "0 12px 32px rgba(196,168,130,0.18)"
          : "0 2px 10px rgba(94,64,51,0.04)",
        transition: "all 0.3s ease",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            color: T.brownDeep,
            fontSize: "1rem",
            lineHeight: 1.4,
          }}
        >
          {q}
        </span>
        <span
          style={{
            fontSize: "1.4rem",
            color: T.gold,
            flexShrink: 0,
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 24px 22px" }}>
          <p
            style={{
              color: T.textMuted,
              fontSize: "0.9rem",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────── */
export default function ShippingPage() {
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: T.offWhite,
        color: T.textPrimary,
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform: translateY(26px); } to { opacity:1; transform: translateY(0); } }
        @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes drift { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-up-1 { animation: fadeUp 0.7s 0.12s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.24s ease both; }
        .float-chip { animation: floaty 5s ease-in-out infinite; }
        .country-chip { transition: all 0.2s ease; }
        .country-chip:hover { transform: translateY(-4px) scale(1.06); box-shadow: 0 10px 24px rgba(196,168,130,0.35); background: #fff !important; }

        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-collage-in {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes hero-route-dot {
          0%   { left: 8%;  top: 86%; opacity: 0; }
          10%  { opacity: 1; }
          50%  { left: 52%; top: 38%; }
          90%  { opacity: 1; }
          100% { left: 88%; top: 10%; opacity: 0; }
        }
        .hero-fade-up   { animation: hero-fade-up 0.7s ease-out both; }
        .hero-fade-up-1 { animation: hero-fade-up 0.7s ease-out 0.1s both; }
        .hero-fade-up-2 { animation: hero-fade-up 0.7s ease-out 0.2s both; }
        .hero-collage   { animation: hero-collage-in 0.8s ease-out 0.15s both; }
        .hero-route-dot { animation: hero-route-dot 5s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade-up, .hero-fade-up-1, .hero-fade-up-2, .hero-collage { animation: none; }
          .hero-route-dot { animation: none; opacity: 0; }
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 56px;
          align-items: center;
        }

        /* ── MOBILE RESPONSIVENESS ── */
        @media (max-width: 768px) {
          /* Hero */
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .hero-collage-wrap {
            height: 320px !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
          .hero-blob { display: none !important; }
          .hero-section-inner {
            padding: 64px 20px 48px !important;
          }

          /* Stat strip */
          .stat-strip {
            gap: 10px !important;
          }
          .stat-strip > div {
            min-width: 80px !important;
            padding: 10px 14px !important;
          }

          /* CTA buttons */
          .hero-cta-row {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .hero-cta-row a {
            text-align: center !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          /* Trust grid */
          .trust-grid {
            grid-template-columns: 1fr !important;
          }

          /* Carriers grid */
          .carriers-grid {
            grid-template-columns: 1fr !important;
          }

          /* Timeline — vertical on mobile */
          .timeline-wrap {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 40px !important;
          }
          .timeline-step {
            flex-direction: row !important;
            align-items: flex-start !important;
            flex: none !important;
            width: 100% !important;
            gap: 20px !important;
            min-width: unset !important;
          }
          .timeline-connector {
            display: none !important;
          }
          .timeline-step-text {
            text-align: left !important;
          }
          .timeline-step-text p {
            text-align: left !important;
          }

          /* Countries chips */
          .countries-wrap {
            gap: 8px !important;
          }

          /* Packaging two-col grid */
          .packaging-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .packaging-image-wrap {
            aspect-ratio: 4/3 !important;
          }
          .packaging-float-badge {
            bottom: -14px !important;
            right: -8px !important;
            padding: 16px !important;
          }

          /* Documentation grid */
          .docs-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .docs-image-wrap {
            order: -1 !important;
          }
          .docs-items-grid {
            grid-template-columns: 1fr !important;
          }

          /* CTA section */
          .cta-section-inner {
            padding: 56px 24px !important;
          }
          .cta-btn-row {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: stretch !important;
          }
          .cta-btn-row a {
            text-align: center !important;
          }

          /* Section padding */
          .section-pad {
            padding: 60px 20px !important;
          }
          .section-pad-sm {
            padding: 40px 20px !important;
          }
        }

        @media (max-width: 480px) {
          .hero-collage-wrap {
            height: 260px !important;
          }
          .hero-mode-pill {
            flex-wrap: wrap !important;
            gap: 8px !important;
            justify-content: center !important;
            border-radius: 16px !important;
            padding: 10px 16px !important;
          }
          .hero-mode-pill span {
            border-right: none !important;
            padding-right: 0 !important;
          }
        }

        @media (max-width: 920px) {
          .hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .hero-collage-wrap { height: 360px !important; margin: 0 auto; }
          .hero-blob { display: none; }
        }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background: T.cream,
        }}
      >
        <div
          className="hero-section-inner"
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "96px 24px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div className="hero-grid">
            {/* ---------- LEFT: TEXT CONTENT ---------- */}
            <div>
              <div
                className="hero-fade-up hero-mode-pill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "16px",
                  background: "#fff",
                  border: `1px solid ${T.warmGray}`,
                  borderRadius: "999px",
                  padding: "10px 22px",
                  marginBottom: "28px",
                  boxShadow: "0 6px 20px rgba(196,168,130,0.18)",
                }}
              >
                {[
                  { icon: "🚢", label: "Sea" },
                  { icon: "✈️", label: "Air" },
                  { icon: "🚚", label: "Road" },
                ].map((mode, i) => (
                  <span
                    key={mode.label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: T.coffee,
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      borderRight: i < 2 ? `1px solid ${T.warmGray}` : "none",
                      paddingRight: i < 2 ? "16px" : 0,
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>{mode.icon}</span>
                    {mode.label}
                  </span>
                ))}
              </div>

              <h1
                className="hero-fade-up-1"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)",
                  fontWeight: 700,
                  lineHeight: 1.12,
                  color: T.brownDeep,
                  marginBottom: "22px",
                }}
              >
                Global Shipping Solutions Across{" "}
                <span
                  style={{
                    background: T.gradGold,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  120+ Countries
                </span>
              </h1>

              <p
                className="hero-fade-up-2"
                style={{
                  color: T.textMuted,
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                  maxWidth: "560px",
                  marginBottom: "36px",
                }}
              >
                Fast, secure & reliable worldwide delivery for essential oils
                and botanical products — with full insurance, transparent
                pricing, and zero compromise on quality.
              </p>

              <div
                className="hero-fade-up-2 hero-cta-row"
                style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
              >
                <a
                  href="mailto:exports@naturesnationalindia.com"
                  style={{
                    background: T.gradGold,
                    color: T.brownDeep,
                    padding: "10px 22px",
                    borderRadius: "999px",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: "0.82rem",
                    boxShadow: "0 10px 30px rgba(196,168,130,0.4)",
                    transition: "transform 0.2s",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-3px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  Request Shipping Quote →
                </a>
                <a
                  href="#carriers"
                  style={{
                    background: "#fff",
                    color: T.brownDeep,
                    padding: "10px 22px",
                    borderRadius: "999px",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "0.82rem",
                    border: `1px solid ${T.warmGray}`,
                    boxShadow: "0 4px 16px rgba(94,64,51,0.06)",
                    display: "inline-block",
                  }}
                >
                  Explore Carriers
                </a>
              </div>

              {/* Stat strip */}
              <div
                className="stat-strip"
                style={{
                  marginTop: "56px",
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { val: "120+", label: "Countries" },
                  { val: "24 hrs", label: "Processing" },
                  { val: "5", label: "Logistics Partners" },
                  { val: "100%", label: "Insured" },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: "#fff",
                      borderRadius: "16px",
                      padding: "14px 22px",
                      border: `1px solid ${T.warmGray}`,
                      boxShadow: "0 6px 20px rgba(94,64,51,0.05)",
                      minWidth: "110px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: T.brownDeep,
                      }}
                    >
                      {s.val}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: T.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginTop: "2px",
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------- RIGHT: PHOTO STACK COLLAGE ---------- */}
            <div
              className="hero-collage hero-collage-wrap"
              style={{
                position: "relative",
                height: "480px",
              }}
            >
              {/* soft gold blob behind the stack */}
              <div
                className="hero-blob"
                style={{
                  position: "absolute",
                  top: "-8%",
                  right: "-6%",
                  width: "78%",
                  height: "78%",
                  borderRadius: "62% 38% 55% 45% / 48% 55% 45% 52%",
                  background:
                    "radial-gradient(circle at 35% 30%, rgba(217,182,121,0.45), rgba(217,182,121,0) 72%)",
                  filter: "blur(2px)",
                  zIndex: 0,
                }}
              />

              {/* dashed route line + traveling dot */}
              <svg
                viewBox="0 0 400 480"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                }}
              >
                <path
                  d="M 40 420 C 140 320, 180 260, 220 190 C 250 140, 300 90, 360 50"
                  fill="none"
                  stroke={T.coffee}
                  strokeWidth="2"
                  strokeDasharray="2 8"
                  strokeLinecap="round"
                  opacity="0.45"
                />
              </svg>
              <div
                className="hero-route-dot"
                style={{
                  position: "absolute",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: T.gradGold,
                  boxShadow: "0 0 0 4px rgba(217,182,121,0.25)",
                  zIndex: 2,
                }}
              />

              {/* main hero photo */}
              <div
                style={{
                  position: "absolute",
                  bottom: "4%",
                  right: "2%",
                  width: "76%",
                  height: "68%",
                  borderRadius: "22px",
                  overflow: "hidden",
                  transform: "rotate(-3deg)",
                  boxShadow: "0 22px 50px rgba(62,39,35,0.25)",
                  zIndex: 3,
                }}
              >
                <img
                  src={shippingImages[0]}
                  alt="Cargo ship carrying export containers"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* secondary polaroid card */}
              <div
                style={{
                  position: "absolute",
                  top: "0%",
                  left: "0%",
                  width: "46%",
                  height: "42%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  transform: "rotate(5deg)",
                  border: "6px solid #fff",
                  boxShadow: "0 16px 36px rgba(62,39,35,0.22)",
                  zIndex: 4,
                }}
              >
                <img
                  src={shippingImages[3]}
                  alt="DHL air freight delivery"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* small accent card */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0%",
                  left: "8%",
                  width: "30%",
                  height: "26%",
                  borderRadius: "14px",
                  overflow: "hidden",
                  transform: "rotate(-7deg)",
                  border: "6px solid #fff",
                  boxShadow: "0 14px 30px rgba(62,39,35,0.2)",
                  zIndex: 5,
                }}
              >
                <img
                  src={shippingImages[1]}
                  alt="Bulk export supply packaging"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* floating insured badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "8%",
                  right: "6%",
                  background: "#fff",
                  borderRadius: "999px",
                  padding: "10px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 10px 26px rgba(62,39,35,0.18)",
                  border: `1px solid ${T.warmGray}`,
                  zIndex: 6,
                }}
              >
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: T.gradGold,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    color: T.brownDeep,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: T.brownDeep,
                  }}
                >
                  100% Insured Shipping
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRUST HIGHLIGHTS ═════════════════════════════ */}
      <section
        className="section-pad-sm"
        style={{ background: T.offWhite, padding: "40px 24px" }}
      >
        <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: T.sageDark,
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Why Ship With Us
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: T.brownDeep,
              }}
            >
              Built On Trust, Backed By Logistics
            </h2>
          </div>
          <div
            className="trust-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "24px",
            }}
          >
            {TRUST.map((t) => (
              <TrustCard key={t.title} item={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ SHIPPING PARTNERS ═══════════════════════════ */}
      <section
        id="carriers"
        className="section-pad"
        style={{ background: T.gradWarm, padding: "96px 24px" }}
      >
        <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: T.sageDark,
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Our Logistics Network
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 700,
                color: T.brownDeep,
                marginBottom: "16px",
              }}
            >
              Five Premium Ways To Ship
            </h2>
            <p
              style={{
                color: T.textMuted,
                maxWidth: "520px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              From a single sample vial to a full container of bulk botanicals —
              choose the carrier that fits your timeline and volume.
            </p>
          </div>
          <div
            className="carriers-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "28px",
            }}
          >
            {CARRIERS.map((c) => (
              <CarrierCard key={c.id} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS TIMELINE ════════════════════════════ */}
      <section
        className="section-pad"
        style={{ background: T.offWhite, padding: "96px 24px" }}
      >
        <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: T.sageDark,
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              From Click To Delivery
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 700,
                color: T.brownDeep,
              }}
            >
              How Every Order Ships
            </h2>
          </div>
          <div
            className="timeline-wrap"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "32px 0",
              justifyContent: "space-between",
            }}
          >
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className="timeline-step"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                  minWidth: "150px",
                  position: "relative",
                }}
              >
                {i < STEPS.length - 1 && (
                  <div
                    className="timeline-connector"
                    style={{
                      position: "absolute",
                      top: "34px",
                      left: "calc(50% + 40px)",
                      width: "calc(100% - 80px)",
                      height: "2px",
                      background: `repeating-linear-gradient(90deg, ${T.brownLight} 0 8px, transparent 8px 16px)`,
                      zIndex: 0,
                    }}
                  />
                )}
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "50%",
                    background: "#fff",
                    border: `2px solid ${T.brownLight}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.7rem",
                    zIndex: 1,
                    boxShadow: "0 4px 14px rgba(94,64,51,0.08)",
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
                <div
                  className="timeline-step-text"
                  style={{ textAlign: "center" }}
                >
                  <div
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: T.gold,
                      letterSpacing: "0.1em",
                      marginTop: "14px",
                    }}
                  >
                    STEP {s.num} · {s.sub}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: T.brownDeep,
                      marginTop: "4px",
                    }}
                  >
                    {s.title}
                  </div>
                  <p
                    style={{
                      color: T.textMuted,
                      fontSize: "0.8rem",
                      lineHeight: 1.6,
                      marginTop: "8px",
                      maxWidth: "190px",
                      margin: "8px auto 0",
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DELIVERY COVERAGE ═══════════════════════════ */}
      <section
        className="section-pad"
        style={{ padding: "96px 24px", position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            inset: "24px",
            borderRadius: "32px",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "24px",
            borderRadius: "32px",
            background:
              "linear-gradient(135deg, rgba(250,248,245,0.94), rgba(248,240,230,0.9))",
          }}
        />
        <div
          style={{
            maxWidth: "1152px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: T.sageDark,
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Worldwide Reach
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 700,
                color: T.brownDeep,
                marginBottom: "16px",
              }}
            >
              We Ship To 120+ Countries
            </h2>
            <p
              style={{
                color: T.textMuted,
                maxWidth: "520px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              From North America to Southeast Asia, our network covers every
              major market for essential oils and botanical extracts.
            </p>
          </div>
          <div
            className="countries-wrap"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
              maxWidth: "880px",
              margin: "0 auto",
            }}
          >
            {COUNTRIES.map((country, i) => (
              <span
                key={country}
                className="float-chip country-chip"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: `1px solid ${T.warmGray}`,
                  color: T.brownDeep,
                  padding: "8px 16px",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 14px rgba(94,64,51,0.06)",
                  animationDelay: `${(i % 6) * 0.4}s`,
                }}
              >
                {country}
              </span>
            ))}
            <span
              style={{
                background: T.gradGold,
                color: T.brownDeep,
                padding: "8px 16px",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 700,
                boxShadow: "0 6px 18px rgba(196,168,130,0.35)",
              }}
            >
              + 90 more countries
            </span>
          </div>
        </div>
      </section>

      {/* ══ PACKAGING EXCELLENCE ════════════════════════ */}
      <section
        className="section-pad"
        style={{ background: T.gradWarm, padding: "96px 24px" }}
      >
        <div
          className="packaging-grid"
          style={{
            maxWidth: "1152px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "center",
          }}
        >
          {/* Image left */}
          <div style={{ position: "relative" }}>
            <div
              className="packaging-image-wrap"
              style={{
                borderRadius: "28px",
                overflow: "hidden",
                aspectRatio: "4/5",
                boxShadow: "0 24px 64px rgba(196,168,130,0.25)",
              }}
            >
              <img
                src="/images/Packaging.jpeg"
                alt="Packaging warehouse"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              className="float-chip packaging-float-badge"
              style={{
                position: "absolute",
                bottom: "-22px",
                right: "-22px",
                background: T.gradGold,
                borderRadius: "20px",
                padding: "22px",
                boxShadow: "0 14px 36px rgba(196,168,130,0.4)",
                maxWidth: "190px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.1rem",
                  fontWeight: 700,
                  color: T.brownDeep,
                }}
              >
                100%
              </div>
              <div
                style={{
                  fontSize: "0.74rem",
                  fontWeight: 600,
                  color: T.brownDeep,
                  lineHeight: 1.4,
                }}
              >
                UN-Certified Packaging
              </div>
            </div>
          </div>
          {/* Content right */}
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: T.sageDark,
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Packaging Excellence
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 700,
                color: T.brownDeep,
                marginBottom: "20px",
                lineHeight: 1.25,
              }}
            >
              Packed For The Long Journey Ahead
            </h2>
            <p
              style={{
                color: T.textMuted,
                lineHeight: 1.8,
                marginBottom: "28px",
              }}
            >
              Essential oils are volatile and classified as flammable liquids
              under international shipping regulations — our team packs to IATA
              Dangerous Goods standards, every time.
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {PACKAGING.map((p) => (
                <div
                  key={p.title}
                  style={{
                    display: "flex",
                    gap: "16px",
                    padding: "18px 20px",
                    background: "#fff",
                    borderRadius: "16px",
                    border: `1px solid ${T.warmGray}`,
                    boxShadow: "0 4px 16px rgba(94,64,51,0.05)",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 10px 28px rgba(196,168,130,0.2)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(94,64,51,0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>
                    {p.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: T.brownDeep,
                        fontSize: "0.92rem",
                        marginBottom: "2px",
                      }}
                    >
                      {p.title}{" "}
                      <span style={{ color: T.gold, fontWeight: 600 }}>
                        · {p.range}
                      </span>
                    </div>
                    <div
                      style={{
                        color: T.textMuted,
                        fontSize: "0.83rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {p.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ DOCUMENTATION STRIP ═══════════════════════════ */}
      <section
        className="section-pad"
        style={{ background: T.offWhite, padding: "96px 24px" }}
      >
        <div
          className="docs-grid"
          style={{
            maxWidth: "1152px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: T.sageDark,
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Compliance & Documentation
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 700,
                color: T.brownDeep,
                marginBottom: "20px",
                lineHeight: 1.25,
              }}
            >
              Every Document, Pre-Prepared
            </h2>
            <p
              style={{
                color: T.textMuted,
                lineHeight: 1.8,
                marginBottom: "28px",
              }}
            >
              We handle the paperwork so customs clearance is smooth from day
              one provided digitally and as originals where required.
            </p>
            <div
              className="docs-items-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              {[
                "Commercial Invoice",
                "Packing List",
                "COA / GC-MS Report",
                "MSDS / SDS Sheet",
                "Phytosanitary Certificate",
                "Country-Specific Permits",
              ].map((d) => (
                <div
                  key={d}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "#fff",
                    border: `1px solid ${T.warmGray}`,
                    borderRadius: "14px",
                    padding: "14px 16px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: T.brownDeep,
                    boxShadow: "0 4px 14px rgba(94,64,51,0.04)",
                  }}
                >
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: T.gradGold,
                      flexShrink: 0,
                    }}
                  />
                  {d}
                </div>
              ))}
            </div>
          </div>
          <div
            className="docs-image-wrap"
            style={{
              borderRadius: "28px",
              overflow: "hidden",
              aspectRatio: "4/3",
              boxShadow: "0 24px 64px rgba(94,64,51,0.12)",
            }}
          >
            <img
              src="/images/exportdoc.jpeg"
              alt="Export documentation"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════ */}
      <section
        className="section-pad"
        style={{ position: "relative", padding: "96px 24px" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: T.gradGold,
            opacity: 0.18,
          }}
        />
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: T.sageDark,
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Common Questions
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 700,
                color: T.brownDeep,
              }}
            >
              Shipping FAQs
            </h2>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {FAQS.map((f) => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "96px 24px" }}>
        <div
          style={{
            maxWidth: "1152px",
            margin: "0 auto",
            borderRadius: "32px",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
            boxShadow: "0 24px 64px rgba(196,168,130,0.3)",
          }}
        >
          <img
            src="/images/ship.jpeg"
            alt="Global delivery"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(62,43,30,0.85), rgba(111,78,55,0.78))",
            }}
          />
          <div
            className="cta-section-inner"
            style={{ position: "relative", zIndex: 1, padding: "80px 40px" }}
          >
            <div style={{ fontSize: "2.6rem", marginBottom: "20px" }}>🌿</div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "16px",
              }}
            >
              Ready To Ship With{" "}
              <span style={{ color: T.brownLight }}>
                Natures Natural India?
              </span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.8,
                maxWidth: "560px",
                margin: "0 auto 36px",
                fontSize: "1rem",
              }}
            >
              Share your product list, destination, and quantity — our export
              team will send a detailed freight comparison within 24 hours, at
              no obligation.
            </p>
            <div
              className="cta-btn-row"
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="mailto:exports@naturesnationalindia.com"
                style={{
                  background: T.gradGold,
                  color: T.brownDeep,
                  padding: "16px 36px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  textDecoration: "none",
                  fontSize: "1rem",
                  boxShadow: "0 10px 30px rgba(196,168,130,0.4)",
                }}
              >
                Request a Shipping Quote
              </a>
              <a
                href="https://wa.me/919999999999"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  padding: "16px 36px",
                  borderRadius: "999px",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "1rem",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                💬 WhatsApp Us
              </a>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.8rem",
                marginTop: "28px",
              }}
            >
              📍 Sahibabad, Uttar Pradesh, India &nbsp;|&nbsp;
              exports@naturesnationalindia.com
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
