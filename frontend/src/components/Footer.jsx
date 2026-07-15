"use client";

import { useState } from "react";
const logo = "/images/logo1.png";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { MapPin, Phone, Mail, Leaf, ChevronRight } from "lucide-react";

/* ── Design Tokens ─────────────────────────────────────────── */
const DS = {
  cream: "#FFF9F2",
  beigeLight: "#F5E6D3",
  beige: "#EDD9C0",
  sand: "#D4B896",
  mocha: "#A67B5B",
  brown: "#8B5E3C",
  brownDark: "#6B4328",
  textDark: "#3E2C23",
  sageLight: "#EBF0E8",
  sage: "#8FA58A",
  sageDark: "#5E7A5A",
};

const T = {
  display: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  body: "'DM Sans', 'Lato', system-ui, sans-serif",
};

const shadows = {
  btn: "0 2px 8px rgba(139,94,60,0.25)",
  btnHover: "0 4px 16px rgba(139,94,60,0.35)",
};

/* ── Shared: PrimaryButton ─────────────────────────────────── */
function PrimaryButton({ children, onClick, style = {} }) {
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
          ? DS.brownDark
          : `linear-gradient(135deg, ${DS.brown}, ${DS.mocha})`,
        color: DS.cream,
        border: "none",
        borderRadius: "4px",
        padding: "12px 24px",
        fontFamily: T.body,
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.6px",
        cursor: "pointer",
        boxShadow: hovered ? shadows.btnHover : shadows.btn,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ── Shared: FooterLink ────────────────────────────────────── */
function FooterLink({ href, onClick, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href || "#"}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: hovered ? "10px" : "6px",
        color: hovered ? DS.sand : "#c8b9a8",
        fontSize: "13px",
        textDecoration: "none",
        fontFamily: T.body,
        transition: "color 0.2s, gap 0.2s",
        marginBottom: "9px",
        lineHeight: "1.4",
      }}
    >
      <ChevronRight size={11} style={{ color: DS.sand, flexShrink: 0 }} />
      {children}
    </a>
  );
}

/* ── Data ──────────────────────────────────────────────────── */
// Every entry below routes to a real, existing page — no "#" placeholders.
const services = [
  { label: "Private Label / OEM", href: "/private-labelling" },
  { label: "Bulk Supply", href: "/bulk-orders" },
  { label: "Custom Blends", href: "/custom-blends" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Free Samples", action: "inquiry" },
  { label: "Packaging", href: "/private-packaging" },
  { label: "Contract Mfg.", href: "/private-labelling" },
];

const company = [
  { label: "About Us", href: "/about-us" },
  { label: "Certifications", href: "/our-certification" },
  { label: "Quality Assurance", href: "/quality-assurance" },
  { label: "Our Process", href: "/#proc-sec" },
  { label: "Blog", href: "/#blog-sec" },
  { label: "Careers", href: "/contact-us" },
  { label: "Contact", href: "/contact-us" },
];

const socials = [
  {
    key: "fb",
    href: "https://www.facebook.com/Naturesnaturalindia.pvt.ltd",
    Icon: FaFacebook,
    label: "Facebook",
  },
  {
    key: "ig",
    href: "https://www.instagram.com/naturenaturalindia/",
    Icon: FaInstagram,
    label: "Instagram",
  },
  {
    key: "li",
    href: "https://www.linkedin.com/company/naturesnaturalindia/",
    Icon: FaLinkedin,
    label: "LinkedIn",
  },
  {
    key: "yt",
    href: "https://www.youtube.com/@Naturesnaturalindia",
    Icon: FaYoutube,
    label: "YouTube",
  },
];

const certs = ["ISO 9001", "WHO-GMP", "HACCP", "HALAL", "KOSHER"];

/* ── Styles ────────────────────────────────────────────────── */
const headingStyle = {
  fontSize: "10.5px",
  textTransform: "uppercase",
  letterSpacing: "2.5px",
  color: "#f0e8dc",
  fontWeight: 700,
  marginBottom: "10px",
  fontFamily: "'DM Sans', 'Lato', system-ui, sans-serif",
};

const iconWrap = {
  width: "28px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(166,123,91,0.1)",
  border: "1px solid rgba(166,123,91,0.2)",
  borderRadius: "4px",
  flexShrink: 0,
};

/* ── Component ─────────────────────────────────────────────── */
export default function Footer({ onInquiryOpen, categories = [] }) {
  const openInquiry = () =>
    onInquiryOpen
      ? onInquiryOpen()
      : window.dispatchEvent(new CustomEvent("open-inquiry"));

  // Same live category list the Navbar renders — every link below opens the
  // identical dynamic /category/[slug] route, never a duplicate page.
  const productLinks = categories.slice(0, 8).map((category) => ({
    label: category.name,
    href: `/category/${category.slug}`,
  }));

  return (
    <footer
      style={{
        backgroundColor: "#1E1208",
        color: "#e8ddd0",
        borderTop: `2px solid ${DS.mocha}`,
        fontFamily: T.body,
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "52px 40px 28px",
        }}
      >
        {/* Main Grid */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2.2fr 1fr 1fr 1fr 1.6fr",
            gap: "48px",
            marginBottom: "36px",
            alignItems: "start",
          }}
        >
          {/* ── Brand Column ── */}
          <div>
            <img
              src={logo}
              alt="Natures Natural India"
              style={{
                width: "auto",
                maxWidth: "250px",
                height: "auto",
                display: "block",
                // mixBlendMode: "lighten",
                objectFit: "contain",
                filter: "brightness(1.4) contrast(1.2)",
                marginTop: "-20px",
              }}
            />
            <div
              style={{
                width: "36px",
                height: "2px",
                background: `linear-gradient(90deg, ${DS.mocha}, transparent)`,
                marginBottom: "14px",
              }}
            />
            <p
              style={{
                fontSize: "13px",
                lineHeight: "1.8",
                marginBottom: "20px",
                color: "#b8a898",
                maxWidth: "270px",
              }}
            >
              Leading manufacturer &amp; exporter of 100% pure essential oils.
              15+ years · 15,000+ B2B clients · 70+ countries.
            </p>

            {/* Social Icons */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              {socials.map(({ key, href, Icon, label }) => {
                const [hov, setHov] = useState(false);
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                    style={{
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: hov ? DS.mocha : "rgba(166,123,91,0.1)",
                      border: `1px solid ${hov ? DS.mocha : "rgba(166,123,91,0.25)"}`,
                      color: hov ? "#fff" : DS.mocha,
                      borderRadius: "4px",
                      transform: hov ? "translateY(-2px)" : "none",
                      transition: "all 0.22s",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>

            {/* Cert Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {certs.map((c) => (
                <span
                  key={c}
                  style={{
                    background: "rgba(166,123,91,0.08)",
                    border: "1px solid rgba(166,123,91,0.25)",
                    padding: "3px 10px",
                    fontSize: "9.5px",
                    color: DS.sand,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    borderRadius: "2px",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* ── Products ── */}
          <div>
            <h4 style={headingStyle}>Products</h4>
            <div
              style={{
                width: "24px",
                height: "1.5px",
                background: DS.mocha,
                marginBottom: "16px",
              }}
            />
            {productLinks.length > 0 ? (
              productLinks.map((p) => (
                <FooterLink key={p.href} href={p.href}>
                  {p.label}
                </FooterLink>
              ))
            ) : (
              <p style={{ fontSize: "12.5px", color: "#8a7a6a" }}>
                Categories coming soon.
              </p>
            )}
          </div>

          {/* ── Services ── */}
          <div>
            <h4 style={headingStyle}>Services</h4>
            <div
              style={{
                width: "24px",
                height: "1.5px",
                background: DS.mocha,
                marginBottom: "16px",
              }}
            />
            {services.map((s) =>
              s.action === "inquiry" ? (
                <FooterLink
                  key={s.label}
                  onClick={(e) => {
                    e.preventDefault();
                    openInquiry();
                  }}
                >
                  {s.label}
                </FooterLink>
              ) : (
                <FooterLink key={s.label} href={s.href}>
                  {s.label}
                </FooterLink>
              ),
            )}
          </div>

          {/* ── Company ── */}
          <div>
            <h4 style={headingStyle}>Company</h4>
            <div
              style={{
                width: "24px",
                height: "1.5px",
                background: DS.mocha,
                marginBottom: "16px",
              }}
            />
            {company.map((item) => (
              <FooterLink key={item.label} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 style={headingStyle}>Contact Us</h4>
            <div
              style={{
                width: "24px",
                height: "1.5px",
                background: DS.mocha,
                marginBottom: "20px",
              }}
            />

            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {/* Address */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <div style={iconWrap}>
                  <MapPin
                    size={13}
                    strokeWidth={1.8}
                    style={{ color: DS.mocha }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.8",
                    color: "#b8a898",
                    margin: 0,
                  }}
                >
                  Plot No. 51/1/6, Site-4,
                  <br />
                  Industrial Area, Sahibabad,
                  <br />
                  Ghaziabad-201010 (UP) India
                </p>
              </div>

              {/* Phone */}
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <div style={iconWrap}>
                  <Phone
                    size={13}
                    strokeWidth={1.8}
                    style={{ color: DS.mocha }}
                  />
                </div>
                <a
                  href="tel:+919711003901"
                  style={{
                    color: "#e8ddd0",
                    textDecoration: "none",
                    fontSize: "13px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = DS.sand)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#e8ddd0")
                  }
                >
                  +91 9711003901
                </a>
              </div>

              {/* Email */}
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <div style={iconWrap}>
                  <Mail
                    size={13}
                    strokeWidth={1.8}
                    style={{ color: DS.mocha }}
                  />
                </div>
                <a
                  href="mailto:info@naturesnaturalindia.com"
                  style={{
                    color: "#e8ddd0",
                    textDecoration: "none",
                    fontSize: "12.5px",
                    transition: "color 0.2s",
                    wordBreak: "break-all",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = DS.sand)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#e8ddd0")
                  }
                >
                  info@naturesnaturalindia.com
                </a>
              </div>
            </div>

            {/* CTA */}
            <PrimaryButton onClick={openInquiry} style={{ marginTop: "22px" }}>
              <Leaf size={13} strokeWidth={2} />
              Get Free Sample
            </PrimaryButton>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div
          style={{
            borderTop: "1px solid rgba(166,123,91,0.2)",
            paddingTop: "18px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "11.5px", color: "#786a5e" }}>
            © 2026 Natures Natural India Oils Pvt. Ltd. All rights reserved.
          </span>
          <span style={{ fontSize: "11.5px", color: "#786a5e" }}>
            {[
              { label: "Privacy Policy", href: "/policies" },
              { label: "Terms", href: "/policies" },
              { label: "Sitemap", href: "/" },
            ].map(({ label: link, href }, i) => (
              <span key={link}>
                {i > 0 && (
                  <span
                    style={{
                      margin: "0 8px",
                      color: "rgba(166,123,91,0.3)",
                    }}
                  >
                    ·
                  </span>
                )}
                <a
                  href={href}
                  style={{
                    color: "#786a5e",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = DS.sand)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#786a5e")
                  }
                >
                  {link}
                </a>
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
          @media (max-width: 1024px) {
            .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; }
          }
          @media (max-width: 640px) {
            .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
    </footer>
  );
}
