const aboutImage = "/images/Aboutusimg.jpeg";
const usdaImg = "/images/USDA.png";
const kosherImg = "/images/Kosher.png";
const halalImg = "/images/Halal.png";
const whoGmpImg = "/images/WHO-GMP.png";
const gmpImg = "/images/GMP.png";
const isoImg = "/images/ISO.png";
const haccpImg = "/images/HACCP.png";
const spicesImg = "/images/Spices Board.png";
// AboutSection.jsx
import React from "react";
import { CheckCircle, Building2 } from "lucide-react";

const certs = [
  { label: "USDA Organic", img: usdaImg },
  { label: "Kosher", img: kosherImg },
  { label: "Halal", img: halalImg },
  { label: "WHO-GMP", img: whoGmpImg },
  { label: "GMP Quality", img: gmpImg },
  { label: "ISO 9001", img: isoImg },
  { label: "HACCP", img: haccpImg },
  { label: "Spices Board", img: spicesImg },
];

const features = [
  {
    icon: <CheckCircle size={15} strokeWidth={1.8} />,
    title: "Quality Assured",
    desc: "GC/MS tested every single batch",
  },
  {
    icon: <Building2 size={15} strokeWidth={1.8} />,
    title: "Private Label",
    desc: "Full OEM & private label services",
  },
];

export default function AboutSection() {
  return (
    <section
      className="about-sec"
      style={{
        background: "var(--color-off-white)",
        padding: "72px 36px",
      }}
      id="about-sec"
    >
      <div
        className="about-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "56px",
          maxWidth: "1200px",
          margin: "0 auto",
          alignItems: "center",
        }}
      >
        {/* ── Left: Image ── */}
        <div style={{ position: "relative" }}>
          <img
            src={aboutImage}
            alt="Essential oils and herbs"
            style={{
              width: "100%",
              height: 500,
              objectFit: "cover",
              display: "block",
              borderRadius: "16px",
              boxShadow: "0 12px 32px rgba(62,43,30,0.18)",
            }}
          />

          {/* Refined border frame */}
          <div
            style={{
              position: "absolute",
              inset: 10,
              border: "2px solid rgba(196,168,130,0.25)",
              borderRadius: "12px",
              pointerEvents: "none",
            }}
          />

          {/* Enhanced years badge */}
          <div
            style={{
              position: "absolute",
              bottom: -14,
              right: -14,
              background: "var(--color-brown-mid)",
              color: "var(--color-cream-white)",
              padding: "22px 28px",
              textAlign: "center",
              minWidth: 130,
              borderRadius: "8px",
              boxShadow: "0 12px 32px rgba(62,43,30,0.28)",
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily:
                  "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: 40,
                fontWeight: 600,
                lineHeight: 1,
                color: "var(--color-cream-white)",
                letterSpacing: "-0.5px",
              }}
            >
              15+
            </span>
            <span
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "var(--color-brown-light)",
                marginTop: 6,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              Years Experience
            </span>
          </div>
        </div>

        {/* ── Right: Content ── */}
        <div>
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
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
                background:
                  "linear-gradient(90deg, var(--color-brown-light), transparent)",
                borderRadius: 2,
                flexShrink: 0,
              }}
            />
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--color-brown-muted)",
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                margin: 0,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              About Us
            </p>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily:
                "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: "clamp(24px, 3vw, 30px)",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              lineHeight: 1.25,
              margin: "0 0 4px",
              letterSpacing: "0.01em",
            }}
          >
            Natures Natural India Oils Pvt. Ltd.
          </h2>

          {/* Decorative rule */}
          <div
            style={{
              width: 36,
              height: 2,
              background:
                "linear-gradient(90deg, var(--color-brown-light), var(--color-brown-muted))",
              borderRadius: 2,
              margin: "16px 0",
            }}
          />

          <p
            style={{
              fontSize: 15,
              color: "var(--color-text-muted)",
              lineHeight: 1.8,
              marginBottom: 14,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 400,
            }}
          >
            Established in 2010, Natures Natural India is a leading manufacturer
            and exporter of 100% pure, natural and certified organic essential
            oils, carrier oils, fragrance oils and allied herbal products —
            headquartered in Sahibabad, Ghaziabad, India.
          </p>
          <p
            style={{
              fontSize: 14.5,
              color: "var(--color-text-muted)",
              lineHeight: 1.8,
              marginBottom: 24,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 400,
            }}
          >
            With state-of-the-art distillation facilities, an in-house GC/MS
            laboratory and a dedicated R&D team, we serve 15,000+ B2B clients
            across 70+ countries.
          </p>

          {/* Feature Grid — only 2 cards now */}

          {/* ── Certifications Strip ── */}
          <CertificationsStrip />
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .about-sec { padding: 48px 18px !important; }
          .about-grid { gap: 36px !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Certifications strip ── */
function CertificationsStrip() {
  return (
    <div>
      {/* Label */}
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "var(--color-brown-muted)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          margin: "0 0 12px",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        Certifications &amp; Accreditations
      </p>

      {/* Cert logos — 4 columns grid, collapses on smaller screens */}
      <div
        className="about-certs-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          padding: "16px 18px",
          background: "rgba(196,168,130,0.06)",
          border: "1px solid rgba(196,168,130,0.22)",
        }}
      >
        {certs.map((c) => (
          <CertBadge key={c.label} label={c.label} img={c.img} />
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .about-certs-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 420px) {
          .about-certs-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Single cert badge ── */
function CertBadge({ label, img }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      title={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "12px 8px",
        background: "transparent" /* ← no white bg */,
        border: `1px solid ${hovered ? "var(--color-brown-light)" : "rgba(196,168,130,0.25)"}`,
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
        boxShadow: hovered ? "0 4px 14px rgba(62,43,30,0.10)" : "none",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        cursor: "default",
      }}
    >
      <img
        src={img}
        alt={label} 
        style={{
          width: 100 /* ← bigger */,
          height: 100,
          objectFit: "contain",
          display: "block",
          filter: hovered ? "none" : "grayscale(10%)",
          transition: "filter 0.2s",
        }}
      />
      <span
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: "var(--color-brown-muted)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Feature card ── */
function FeatureCard({ icon, title, desc }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        padding: "12px 14px",
        borderRadius: 4,
        border: `1px solid ${hovered ? "var(--color-brown-light)" : "var(--color-warm-gray)"}`,
        background: hovered ? "var(--color-cream-white)" : "transparent",
        transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
        boxShadow: hovered ? "0 2px 12px rgba(62,43,30,0.08)" : "none",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          minWidth: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: hovered
            ? "rgba(196,168,130,0.15)"
            : "rgba(196,168,130,0.08)",
          border: `1px solid ${hovered ? "var(--color-brown-light)" : "rgba(196,168,130,0.20)"}`,
          borderRadius: 4,
          color: "var(--color-brown-mid)",
          transition: "background 0.2s, border-color 0.2s",
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: "var(--color-text-primary)",
            marginBottom: 3,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: 12,
            color: "var(--color-text-muted)",
            lineHeight: 1.55,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 400,
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}
