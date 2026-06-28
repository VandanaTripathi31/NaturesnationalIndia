import { useState } from "react";
import cosmetic from "../../public/images/cosmetic.jpeg";
import aroth from "../../public/images/aroth.jpeg";
import fragrance from "../../public/images/Fragrances Oils-1.jpg";
import ph from "../../public/images/ph.jpg";
import spa from "../../public/images/aromotherapy.jpeg";
import candles from "../../public/images/candles.jpeg";
import soap from "../../public/images/soap.jpeg";
import hair from "../../public/images/hair.png";
import bath from "../../public/images/bath.png";
import foood from "../../public/images/foood.png";
import nutra from "../../public/images/nutraceteulas.jpg";
import ayur from "../../public/images/ayurvedic-oil-glass-bottle-herbal.jpg";

const industries = [
  {
    name: "Cosmetics & Skincare",
    desc: "Serums, lotions, face oils",
    img: cosmetic,
  },
  { name: "Aromatherapy", desc: "Diffuser blends, massage, spa", img: aroth },
  {
    name: "Ayurveda & Wellness",
    desc: "Traditional herbal formulations",
    img: ayur,
  },
  { name: "Pharmaceuticals", desc: "API, excipients, medicinal", img: ph },
  {
    name: "Perfumery & Fragrance",
    desc: "Fine fragrances, attars",
    img: fragrance,
  },
  { name: "Hair Care", desc: "Growth oils, conditioners", img: hair },
  {
    name: "Candles & Home Fragrance",
    desc: "Scented candles, wax melts",
    img: candles,
  },
  { name: "Soaps & Detergents", desc: "Natural soaps, cleansers", img: soap },
  { name: "Exfoliators & Bath", desc: "Scrubs, bath salts", img: bath },
  { name: "Food & Beverages", desc: "Food-grade flavours", img: foood },
  { name: "Nutraceuticals", desc: "Supplements, wellness", img: nutra },
  { name: "Spa & Hospitality", desc: "Therapeutic blends", img: spa },
];

export default function IndustriesWeServe() {
  const [hovered, setHovered] = useState(null);

  return (
    <section
      style={{ backgroundColor: "var(--color-brown-deep)" }}
      className="px-6 md:px-9 pb-16"
    >
      {/* Header */}
      <div className="text-center mb-10 pt-10">
        {/* Eyebrow with side rules — matches site pattern */}
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
            Who We Supply
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
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 600,
            color: "var(--color-cream-white)",
            marginBottom: 12,
            letterSpacing: "0.01em",
          }}
        >
          Industries We Serve
        </h2>

        <p
          style={{
            fontSize: 14,
            color: "var(--color-brown-light)",
            maxWidth: 480,
            margin: "6px auto 0",
            lineHeight: 1.75,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 400,
          }}
        >
          Our oils power leading brands across 12+ global industries.
        </p>

        <div
          style={{
            width: 40,
            height: 2,
            background:
              "linear-gradient(90deg, var(--color-brown-muted), var(--color-brown-light))",
            margin: "18px auto 0",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Grid */}
      <div
        className="grid gap-3.5 mx-auto ind-grid-inner"
        style={{
          maxWidth: 1220,
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {industries.map((ind, i) => (
          <div
            key={i}
            className="relative overflow-hidden cursor-pointer"
            style={{
              height: 195,
              borderRadius: 6,
              border: `1px solid ${hovered === i ? "var(--color-brown-muted)" : "rgba(196,168,130,0.15)"}`,
              boxShadow:
                hovered === i
                  ? "0 10px 28px rgba(0,0,0,0.35)"
                  : "0 2px 8px rgba(0,0,0,0.18)",
              transition: "box-shadow 0.3s ease, border-color 0.3s ease",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Image */}
            <img
              src={ind.img}
              alt={ind.name}
              className="w-full h-full object-cover"
              style={{
                transition: "transform 0.5s ease",
                transform: hovered === i ? "scale(1.07)" : "scale(1)",
              }}
            />

            {/* Gradient overlay */}
            <div
              className="absolute inset-0 flex flex-col justify-end"
              style={{
                background:
                  "linear-gradient(to top, rgba(20,10,4,0.92) 0%, rgba(20,10,4,0.20) 55%, transparent 100%)",
                padding: "16px 14px",
              }}
            >
              <p
                style={{
                  fontSize: 14.5,
                  color: "var(--color-cream-white)",
                  fontFamily:
                    "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  marginBottom: 2,
                }}
              >
                {ind.name}
              </p>

              <p
                style={{
                  fontSize: 11.5,
                  color: "rgba(196,168,130,0.75)",
                  letterSpacing: "0.02em",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                {ind.desc}
              </p>

              {/* Accent underline on hover */}
              <div
                style={{
                  height: 2,
                  borderRadius: 1,
                  background: "var(--color-brown-light)",
                  marginTop: 7,
                  transition: "width 0.35s ease",
                  width: hovered === i ? "36px" : "0px",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Responsive styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');
        @media (max-width: 1024px) { .ind-grid-inner { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 768px)  { .ind-grid-inner { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px)  { .ind-grid-inner { grid-template-columns: repeat(1, 1fr) !important; } }
      `}</style>
    </section>
  );
}
