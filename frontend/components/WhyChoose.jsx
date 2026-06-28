const whoGmpImg = "/images/certificate1.png";
const kosherImg = "/images/certificate5.png";
const usdaImg = "/images/certificate2.png";
const halalImg = "/images/certificate3.png";
const isoImg = "/images/certifiacte4.png";
// WhyChooseUs.jsx
import { useState } from "react";
import {
  Clock,
  FlaskConical,
  Package,
  Tag,
  ShoppingBag,
  FileText,
  ClipboardCheck,
  Zap,
  Award,
  Globe,
  Users,
  ShieldCheck,
  X,
  Download,
  ExternalLink,
} from "lucide-react";
const CERT_PDF = "../../public/images/2025 NNIOPL Certificates (1).pdf"; // ← update this path

const certs = [
  {
    img: whoGmpImg,
    alt: "WHO-GMP Certificate",
    name: "WHO-GMP",
    issuer: "UK International Certification Ltd",
    number: "GMP25062045",
    validity: "Valid till 24 Jun 2028",
    accentBg: "linear-gradient(160deg,#e8f0fa,#d0e2f5)",
  },
  {
    img: kosherImg,
    alt: "Kosher Certificate",
    name: "Kosher",
    issuer: "UK International Certification Ltd",
    number: "KOSH25062046",
    validity: "Valid till 24 Jun 2028",
    accentBg: "linear-gradient(160deg,#e8f5ea,#d0efd4)",
  },
  {
    img: usdaImg,
    alt: "USDA Organic Certificate",
    name: "HACCP",
    issuer: "US Dept. of Agriculture",
    number: "Certified Organic",
    validity: "Valid till 24 Jun 2028",
    accentBg: "linear-gradient(160deg,#fdf6e8,#f5e9cc)",
  },
  {
    img: halalImg,
    alt: "Halal Certificate",
    name: "Halal",
    issuer: "Halal Certification Authority",
    number: "Halal Compliant",
    validity: "Valid till 24 Jun 2028",
    accentBg: "linear-gradient(160deg,#fdecea,#f8d8d5)",
  },
  {
    img: isoImg,
    alt: "ISO 9001:2015 Certificate",
    name: "ISO 9001:2015",
    issuer: "UK International Certification Ltd",
    number: "Quality Mgmt.",
    validity: "Valid till 24 Jun 2028",
    accentBg: "linear-gradient(160deg,#eaf2fe,#d4e6fb)",
  },
  {
    img: whoGmpImg,
    alt: "WHO-GMP Certificate",
    name: "WHO-GMP",
    issuer: "UK International Certification Ltd",
    number: "GMP25062045",
    validity: "Valid till 24 Jun 2028",
    accentBg: "linear-gradient(160deg,#e8f0fa,#d0e2f5)",
  },
];

/* ─── PDF MODAL ──────────────────────────────────────────────────────────── */
function PdfModal({ onClose, pdfUrl, certName }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(20,10,5,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          width: "100%",
          maxWidth: 820,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid var(--color-warm-gray)",
            background: "linear-gradient(90deg,#fffcf8,#fdf6ee)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Award size={18} style={{ color: "var(--color-brown-muted)" }} />
            <span
              style={{
                fontFamily:
                  "'Cormorant Garamond','Playfair Display',Georgia,serif",
                fontSize: 17,
                fontWeight: 600,
                color: "var(--color-text-primary)",
              }}
            >
              {certName} — Certificate
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Download button */}
            <a
              href={pdfUrl}
              download
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 16px",
                borderRadius: 6,
                background:
                  "linear-gradient(135deg,var(--color-brown-light),var(--color-brown-muted))",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textDecoration: "none",
                fontFamily: "'DM Sans',system-ui,sans-serif",
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Download size={13} />
              Download PDF
            </a>
            {/* Open in new tab */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 6,
                border: "1px solid var(--color-warm-gray)",
                color: "var(--color-text-muted)",
                background: "#fff",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <ExternalLink size={14} />
            </a>
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 6,
                border: "1px solid var(--color-warm-gray)",
                color: "var(--color-text-muted)",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PDF viewer */}
        <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            title={`${certName} Certificate`}
            style={{
              width: "100%",
              height: "100%",
              minHeight: "60vh",
              border: "none",
            }}
          />
        </div>

        {/* Mobile fallback bar */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid var(--color-warm-gray)",
            background: "#fafaf8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            flexShrink: 0,
          }}
          className="modal-mobile-bar"
        >
          <span
            style={{
              fontSize: 11,
              color: "var(--color-text-muted)",
              fontFamily: "'DM Sans',system-ui,sans-serif",
            }}
          >
            Can't see the PDF?
          </span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--color-brown-muted)",
              fontFamily: "'DM Sans',system-ui,sans-serif",
              textDecoration: "underline",
            }}
          >
            Open in browser →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── CERT CARD ──────────────────────────────────────────────────────────── */
function CertCard({
  img,
  alt,
  name,
  issuer,
  number,
  validity,
  accentBg,
  onViewCert,
}) {
  return (
    <div
      className="group flex-shrink-0 overflow-hidden transition-all duration-300 hover:-translate-y-[6px]"
      style={{
        width: "clamp(170px, 48vw, 220px)",
        background: "#fff",
        border: "1px solid var(--color-warm-gray)",
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(92,64,51,0.07)",
        scrollSnapAlign: "start",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 16px 36px rgba(92,64,51,0.16)";
        e.currentTarget.style.borderColor = "var(--color-brown-light)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(92,64,51,0.07)";
        e.currentTarget.style.borderColor = "var(--color-warm-gray)";
      }}
    >
      {/* Certificate image — taller */}
      <div
        className="relative overflow-hidden"
        style={{
          height: "clamp(260px, 36vw, 320px)",
          background: accentBg,
          borderBottom: "1px solid var(--color-warm-gray)",
        }}
      >
        <img
          src={img}
          alt={alt}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.04]"
        />
        {/* Hover overlay — clickable */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     flex items-end justify-center pb-4"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(44,26,16,0.62) 100%)",
          }}
          onClick={onViewCert}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: 20,
              padding: "6px 18px",
              background: "rgba(255,255,255,0.14)",
              fontFamily: "'DM Sans',system-ui,sans-serif",
              cursor: "pointer",
            }}
          >
            View Certificate
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 16px 14px" }}>
        <p
          style={{
            fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--color-text-primary)",
            marginBottom: 3,
            lineHeight: 1.25,
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontSize: 11,
            color: "var(--color-text-muted)",
            marginBottom: 12,
            fontFamily: "'DM Sans',system-ui,sans-serif",
          }}
        >
          {issuer}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: "var(--color-text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            {number}
          </span>
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#2e7d32",
              background: "rgba(46,125,50,0.08)",
              padding: "3px 9px",
              borderRadius: 20,
              border: "1px solid rgba(46,125,50,0.2)",
              fontFamily: "'DM Sans',system-ui,sans-serif",
            }}
          >
            Active
          </span>
        </div>
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid var(--color-warm-gray)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M9 16l2 2 4-4" />
            </svg>
            <span
              style={{
                fontSize: 10.5,
                color: "var(--color-text-muted)",
                fontFamily: "'DM Sans',system-ui,sans-serif",
              }}
            >
              {validity}
            </span>
          </div>
          {/* Mobile tap button */}
          <button
            onClick={onViewCert}
            style={{
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-brown-muted)",
              background: "transparent",
              border: "1px solid var(--color-brown-light)",
              borderRadius: 20,
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "'DM Sans',system-ui,sans-serif",
            }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────────── */
export default function WhyChooseUs() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCert, setActiveCert] = useState(null);

  const openModal = (cert) => {
    setActiveCert(cert);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveCert(null);
    document.body.style.overflow = "";
  };

  return (
    <>
      {/* PDF Modal */}
      {modalOpen && activeCert && (
        <PdfModal
          onClose={closeModal}
          pdfUrl={CERT_PDF}
          certName={activeCert.name}
        />
      )}

      <section
        className="py-16 px-4 sm:px-9"
        style={{ background: "var(--color-cream-white)" }}
        id="why-sec"
      >
        <div className="max-w-[1100px] mx-auto mt-[-35px]">
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
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
                    "linear-gradient(90deg,transparent,var(--color-brown-light))",
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
                  fontFamily: "'DM Sans',system-ui,sans-serif",
                }}
              >
                Our Strengths
              </p>
              <span
                style={{
                  display: "inline-block",
                  width: 24,
                  height: 1.5,
                  background:
                    "linear-gradient(90deg,var(--color-brown-light),transparent)",
                  borderRadius: 2,
                }}
              />
            </div>
            <h2
              style={{
                fontFamily:
                  "'Cormorant Garamond','Playfair Display',Georgia,serif",
                fontSize: "clamp(24px,4vw,36px)",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                marginBottom: 12,
                letterSpacing: "0.01em",
              }}
            >
              Why Choose Natures Natural India
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-text-muted)",
                maxWidth: 480,
                margin: "6px auto 0",
                lineHeight: 1.75,
                fontFamily: "'DM Sans',system-ui,sans-serif",
              }}
            >
              Trusted by 15,000+ B2B clients across 70+ countries — here's why
              global brands choose Natures Natural India.
            </p>
            <div
              style={{
                width: 40,
                height: 2,
                background:
                  "linear-gradient(90deg,var(--color-brown-light),var(--color-brown-muted))",
                margin: "18px auto 0",
                borderRadius: 2,
              }}
            />
          </div>

          {/* ── Certifications label — BIGGER ─────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                flex: 1,
                maxWidth: 120,
                height: 1,
                background:
                  "linear-gradient(90deg,transparent,var(--color-brown-light))",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Award
                size={22}
                strokeWidth={1.8}
                style={{ color: "var(--color-brown-muted)" }}
              />
              <p
                style={{
                  fontSize: "clamp(16px,3vw,22px)",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  margin: 0,
                  fontFamily:
                    "'Cormorant Garamond','Playfair Display',Georgia,serif",
                  fontStyle: "italic",
                }}
              >
                International Certifications
              </p>
              <Award
                size={22}
                strokeWidth={1.8}
                style={{ color: "var(--color-brown-muted)" }}
              />
            </div>
            <div
              style={{
                flex: 1,
                maxWidth: 120,
                height: 1,
                background:
                  "linear-gradient(90deg,var(--color-brown-light),transparent)",
              }}
            />
          </div>

          {/* Scrollable gallery */}
          <div
            style={{
              display: "flex",
              gap: "clamp(12px,3vw,20px)",
              overflowX: "auto",
              padding: "6px 2px 20px",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
            className="[&::-webkit-scrollbar]:hidden"
          >
            {certs.map((c, i) => (
              <CertCard
                key={`${c.name}-${i}`}
                {...c}
                onViewCert={() => openModal(c)}
              />
            ))}
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "var(--color-text-muted)",
              marginTop: 2,
              letterSpacing: "0.06em",
              opacity: 0.65,
              fontFamily: "'DM Sans',system-ui,sans-serif",
            }}
          >
            ← swipe to explore all certificates →
          </p>
        </div>
      </section>
    </>
  );
}
