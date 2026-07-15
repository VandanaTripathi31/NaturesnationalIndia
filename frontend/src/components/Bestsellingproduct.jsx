const arganoil = "/images/Pure-Argan-Oil-Ps.jpg";
const coldpressedarganoil = "/images/castor oil.jpeg";
const goldenjojoba = "/images/Golden-Jojoba-Oil-Ps.jpg";
const lavender = "/images/Lavender-Essential-Oil-Ps.jpg";
const oliveoil = "/images/carrier-olive oil.jpeg";
const peppermint = "/images/Peppermint-Essential-Oil-Ps.jpg";
const brahmi = "/images/Brahmi-Ayurvedic-Hair-Oil-Ps.jpg";
const customblend = "/images/synergy.jpeg";
// BestSellingProducts.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
const products = [
  {
    name: "Pure Argan Oil",
    subtitle: "Cold Pressed · Certified Organic",
    moq: "1 KG",
    img: arganoil,
  },
  {
    name: "Cold Pressed Castor Oil",
    subtitle: "Cold Pressed · Certified Organic",
    moq: "1 KG",
    img: coldpressedarganoil,
  },
  {
    name: "Golden Jojoba Oil",
    subtitle: "Hexane-Free · India Origin",
    moq: "1 KG",
    img: goldenjojoba,
  },
  {
    name: "Lavender Essential Oil",
    subtitle: "Steam Distilled · Bulgaria · GC/MS",
    moq: "500 ML",
    img: lavender,
  },
  {
    name: "Extra Virgin Olive Oil",
    subtitle: "Cold Pressed · Mediterranean",
    moq: "5 KG",
    img: oliveoil,
  },
  {
    name: "Peppermint Essential Oil",
    subtitle: "Steam Distilled · High Menthol",
    moq: "500 ML",
    img: peppermint,
  },
  {
    name: "Brahmi Ayurvedic Hair Oil",
    subtitle: "Traditional Formula · Multi-herb",
    moq: "500 ML",
    img: brahmi,
  },
  {
    name: "Custom Synergy Blends",
    subtitle: "Wellness · Aromatherapy",
    moq: "500 ML",
    img: customblend,
  },
];

const GAP = 20;

function ProductCard({ name, subtitle, moq, img, cardsVisible }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: `calc(${100 / cardsVisible}% - ${(GAP * (cardsVisible - 1)) / cardsVisible}px)`,
        flexShrink: 0,
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 24px 52px rgba(62,43,30,0.22), 0 6px 16px rgba(62,43,30,0.12)"
          : "0 2px 12px rgba(62,43,30,0.08)",
        transition:
          "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s",
        background: "#1a0f0a",
      }}
    >
      {/* ── Image ── */}
      <div style={{ height: 240, overflow: "hidden", position: "relative" }}>
        <img
          src={img}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.08)" : "scale(1.02)",
            transition: "transform 0.65s cubic-bezier(0.22,1,0.36,1)",
            opacity: hovered ? 0.85 : 1,
          }}
        />

        {/* gradient overlay on image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(20,8,2,0.65) 100%)",
          }}
        />

        {/* Arrow button — top right, appears on hover */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--color-brown-mid)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transform: hovered
              ? "scale(1) rotate(0deg)"
              : "scale(0.7) rotate(-15deg)",
            transition: "opacity 0.3s, transform 0.3s",
            boxShadow: "0 2px 10px rgba(62,43,30,0.35)",
          }}
        >
          <ArrowUpRight
            size={15}
            color="var(--color-cream-white)"
            strokeWidth={2}
          />
        </div>

        {/* Golden shimmer line at top on hover */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, var(--color-brown-light), transparent)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s",
          }}
        />
      </div>

      {/* ── Card body ── */}
      <div
        style={{
          padding: "16px 18px 18px",
          background: hovered
            ? "linear-gradient(135deg, #2a1710 0%, #1e0f08 100%)"
            : "linear-gradient(135deg, #221209 0%, #1a0c06 100%)",
          transition: "background 0.4s",
          borderTop: `1px solid rgba(196,168,130,${hovered ? "0.22" : "0.10"})`,
        }}
      >
        {/* Thin gold rule */}
        <div
          style={{
            width: hovered ? 48 : 24,
            height: 1.5,
            background:
              "linear-gradient(90deg, var(--color-brown-light), var(--color-brown-muted))",
            borderRadius: 2,
            marginBottom: 10,
            transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)",
          }}
        />

        <p
          style={{
            fontFamily:
              "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: 17,
            fontWeight: 600,
            color: "var(--color-cream-white)",
            margin: "0 0 5px",
            lineHeight: 1.25,
            letterSpacing: "0.01em",
          }}
        >
          {name}
        </p>

        <p
          style={{
            fontSize: 11,
            color: "rgba(196,168,130,0.75)",
            margin: "0 0 16px",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 400,
            letterSpacing: "0.02em",
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>

        {/* Request Quote button */}
        <button
          style={{
            width: "100%",
            padding: "9px 0",
            border: `1px solid ${hovered ? "var(--color-brown-light)" : "rgba(196,168,130,0.30)"}`,
            background: hovered
              ? "linear-gradient(90deg, var(--color-brown-mid), var(--color-coffee-brown))"
              : "transparent",
            color: hovered
              ? "var(--color-cream-white)"
              : "rgba(196,168,130,0.80)",
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          Request Quote
          <ArrowUpRight size={11} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default function BestSellingProducts() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(4);
  const [prevBtnHov, setPrevBtnHov] = useState(false);
  const [nextBtnHov, setNextBtnHov] = useState(false);
  const [viewAllHov, setViewAllHov] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth < 640) setCardsVisible(1);
      else if (window.innerWidth < 768) setCardsVisible(2);
      else if (window.innerWidth < 1024) setCardsVisible(3);
      else setCardsVisible(4);
    };
    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  const TOTAL_SLIDES = products.length - cardsVisible;
  const DOTS = TOTAL_SLIDES + 1;

  const goTo = (i) => {
    const next = Math.max(0, Math.min(TOTAL_SLIDES, i));
    setIndex(next);
    if (trackRef.current) {
      const card = trackRef.current.children[0];
      if (!card) return;
      trackRef.current.style.transform = `translateX(-${next * (card.offsetWidth + GAP)}px)`;
    }
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1 > TOTAL_SLIDES ? 0 : prev + 1;
        requestAnimationFrame(() => goTo(next));
        return next;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, [isHovered, TOTAL_SLIDES]);

  return (
    <section
      id="prod-sec"
      style={{
        background: "var(--color-off-white)",
        paddingBottom: 72,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          textAlign: "center",
          padding: "72px 36px 0",
          marginBottom: 40,
        }}
      >
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
                "linear-gradient(90deg, transparent, var(--color-brown-light))",
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
            Featured Products
          </p>
          <span
            style={{
              display: "inline-block",
              width: 24,
              height: 1.5,
              background:
                "linear-gradient(90deg, var(--color-brown-light), transparent)",
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
            color: "var(--color-text-primary)",
            margin: "0 0 12px",
            letterSpacing: "0.01em",
          }}
        >
          Best Selling Products
        </h2>

        <p
          style={{
            fontSize: 14,
            color: "var(--color-text-muted)",
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.75,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 400,
          }}
        >
          Most requested by our global B2B buyers — consistent quality,
          competitive pricing, reliable supply.
        </p>

        <div
          style={{
            width: 40,
            height: 2,
            background:
              "linear-gradient(90deg, var(--color-brown-light), var(--color-brown-muted))",
            margin: "18px auto 0",
            borderRadius: 2,
          }}
        />
      </div>

      {/* ── Carousel ── */}
      <div
        style={{
          overflow: "hidden",
          maxWidth: "calc(1220px + 72px)",
          margin: "0 auto",
          padding: "0 36px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: GAP,
            transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {products.map((p) => (
            <ProductCard key={p.name} {...p} cardsVisible={cardsVisible} />
          ))}
        </div>
      </div>

      {/* ── Controls ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          marginTop: 28,
        }}
      >
        <button
          onClick={() => goTo(index - 1)}
          onMouseEnter={() => setPrevBtnHov(true)}
          onMouseLeave={() => setPrevBtnHov(false)}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: `1px solid ${prevBtnHov ? "var(--color-dark-brown)" : "var(--color-warm-gray)"}`,
            background: prevBtnHov
              ? "var(--color-dark-brown)"
              : "var(--color-cream-white)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.22s",
            boxShadow: prevBtnHov ? "0 2px 10px rgba(62,43,30,0.18)" : "none",
          }}
        >
          <ChevronLeft
            size={15}
            color={
              prevBtnHov ? "var(--color-cream-white)" : "var(--color-brown-mid)"
            }
          />
        </button>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {Array.from({ length: DOTS }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                height: 6,
                width: i === index ? 24 : 6,
                borderRadius: 3,
                background:
                  i === index
                    ? "var(--color-brown-mid)"
                    : "var(--color-warm-gray)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.3s, background 0.3s",
                boxShadow:
                  i === index ? "0 1px 4px rgba(122,85,68,0.30)" : "none",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(index + 1)}
          onMouseEnter={() => setNextBtnHov(true)}
          onMouseLeave={() => setNextBtnHov(false)}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: `1px solid ${nextBtnHov ? "var(--color-dark-brown)" : "var(--color-warm-gray)"}`,
            background: nextBtnHov
              ? "var(--color-dark-brown)"
              : "var(--color-cream-white)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.22s",
            boxShadow: nextBtnHov ? "0 2px 10px rgba(62,43,30,0.18)" : "none",
          }}
        >
          <ChevronRight
            size={15}
            color={
              nextBtnHov ? "var(--color-cream-white)" : "var(--color-brown-mid)"
            }
          />
        </button>
      </div>

      {/* ── View All ── */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <a
          href="#cat-sec"
          onMouseEnter={() => setViewAllHov(true)}
          onMouseLeave={() => setViewAllHov(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: `1.5px solid ${viewAllHov ? "var(--color-dark-brown)" : "var(--color-brown-light)"}`,
            color: viewAllHov
              ? "var(--color-cream-white)"
              : "var(--color-dark-brown)",
            background: viewAllHov ? "var(--color-dark-brown)" : "transparent",
            fontSize: 12,
            fontWeight: 700,
            padding: "11px 30px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.25s",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            borderRadius: 100,
            boxShadow: viewAllHov ? "0 4px 16px rgba(62,43,30,0.18)" : "none",
          }}
        >
          View All 500+ Products
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </a>
      </div>
    </section>
  );
}
