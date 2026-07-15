import {
  ClipboardList,
  FlaskConical,
  TriangleAlert,
  BarChart3,
} from "lucide-react";

const docs = [
  {
    icon: (
      <ClipboardList
        size={26}
        strokeWidth={1.6}
        style={{ color: "var(--color-brown-light)" }}
      />
    ),
    title: "COA",
    desc: "Certificate of Analysis — batch-specific reports.",
    link: "Download COA →",
  },
  {
    icon: (
      <FlaskConical
        size={26}
        strokeWidth={1.6}
        style={{ color: "var(--color-brown-light)" }}
      />
    ),
    title: "GC/MS Reports",
    desc: "Gas Chromatography Mass Spectrometry analysis.",
    link: "Download GC-MS →",
  },
  {
    icon: (
      <TriangleAlert
        size={26}
        strokeWidth={1.6}
        style={{ color: "var(--color-brown-light)" }}
      />
    ),
    title: "MSDS / SDS",
    desc: "Material Safety Data Sheets for safe handling.",
    link: "Download MSDS →",
  },
  {
    icon: (
      <BarChart3
        size={26}
        strokeWidth={1.6}
        style={{ color: "var(--color-brown-light)" }}
      />
    ),
    title: "Technical Sheets",
    desc: "Refractive index, optical rotation, specific gravity.",
    link: "Download TDS →",
  },
];

export default function DocsSection() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundImage: "url('/images/Quality.jpg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="px-4 py-12 md:py-15"
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(105deg, rgba(20,10,4,0.93) 0%, rgba(20,10,4,0.82) 50%, rgba(20,10,4,0.68) 100%)",
          zIndex: 1,
        }}
      />

      <div
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        style={{ position: "relative", zIndex: 2 }}
      >
        {/* ── LEFT: copy ── */}
        <div>
          {/* Eyebrow — site-wide pattern */}
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
                background:
                  "linear-gradient(90deg, transparent, var(--color-brown-muted))",
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
              Documentation
            </p>
            <span
              style={{
                display: "inline-block",
                width: 24,
                height: 1.5,
                background:
                  "linear-gradient(90deg, var(--color-brown-muted), transparent)",
                borderRadius: 2,
              }}
            />
          </div>

          <h2
            style={{
              fontFamily:
                "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 600,
              color: "var(--color-cream-white)",
              lineHeight: 1.15,
              marginBottom: 20,
              letterSpacing: "0.01em",
            }}
          >
            Quality
            <br />
            Assurance
          </h2>

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.8,
              marginBottom: 32,
              color: "var(--color-brown-light)",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 400,
              maxWidth: 400,
            }}
          >
            Complete quality documentation to support your regulatory
            compliance, product development and import requirements.
          </p>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("open-inquiry"));
            }}
            style={{
              display: "inline-block",
              padding: "11px 28px",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--color-brown-deep)",
              background: "var(--color-brown-light)",
              borderRadius: 2,
              textDecoration: "none",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Request Documents
          </a>
        </div>

        {/* ── RIGHT: cards grid ── */}
        <div className="grid grid-cols-2 gap-3.5">
          {docs.map((d, i) => (
            <div
              key={i}
              className="group p-5 cursor-pointer transition-all duration-200"
              style={{
                background: "rgba(20,10,4,0.40)",
                border: "1px solid rgba(196,168,130,0.18)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: 4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(196,168,130,0.10)";
                e.currentTarget.style.borderColor = "rgba(196,168,130,0.50)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(20,10,4,0.40)";
                e.currentTarget.style.borderColor = "rgba(196,168,130,0.18)";
              }}
            >
              <div style={{ marginBottom: 12 }}>{d.icon}</div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--color-cream-white)",
                  marginBottom: 6,
                  fontFamily:
                    "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  letterSpacing: "0.01em",
                }}
              >
                {d.title}
              </p>
              <p
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.7,
                  marginBottom: 12,
                  color: "var(--color-brown-light)",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  opacity: 0.85,
                }}
              >
                {d.desc}
              </p>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-brown-light)",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  letterSpacing: "0.04em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {d.link}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
