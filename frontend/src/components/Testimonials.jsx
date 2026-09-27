import { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    initials: "JM",
    name: "James Mitchell",
    company: "Aromatherapy Brand · UK",
    text: "We have been sourcing Lavender and Peppermint oils for 3 years. Consistency, competitive pricing and fast delivery make them our go-to supplier.",
  },
  {
    initials: "SM",
    name: "Sophie Müller",
    company: "Skincare Manufacturer · Germany",
    text: "Argan and Jojoba carrier oils are exceptional. GC/MS reports with every shipment give us full confidence. Our cosmetics line has scaled significantly.",
  },
  {
    initials: "RK",
    name: "Rahul Kapoor",
    company: "Wellness Brand · Australia",
    text: "Very professional. They helped with custom blends, private labeling and formulation advice. The Ayurvedic range quality is outstanding.",
  },
  {
    initials: "AK",
    name: "Ahmed Al-Khalidi",
    company: "Wellness Retailer · UAE",
    text: "WHO-GMP and HALAL certifications make compliance easy for our Middle East clients. Fast shipment, accurate documentation every time.",
  },
  {
    initials: "LT",
    name: "Laura Thompson",
    company: "Spa Chain · Canada",
    text: "Synergy blends from Natures Natural are incredible. We use them for our spa line across 12 locations. Sample turnaround and bulk pricing — both excellent.",
  },
  {
    initials: "DR",
    name: "Daniel Rosenberg",
    company: "Health Products · USA",
    text: "KOSHER certification was key. Natures Natural India was the only Indian supplier who could provide it. Great partnership!",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(3);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardsVisible(1);
      else if (window.innerWidth < 1024) setCardsVisible(2);
      else setCardsVisible(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MAX_INDEX = testimonials.length - cardsVisible;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goTo = (index) => setCurrent(Math.max(0, Math.min(index, MAX_INDEX)));
  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  return (
    <section
      ref={sectionRef}
      className="w-full px-6"
      style={{
        backgroundColor: "var(--color-off-white)",
        paddingTop: "64px",
        paddingBottom: "64px",
      }}
    >
      {/* Header — site-wide pattern */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 56,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
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
            Client Voices
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
            letterSpacing: "0.01em",
            marginBottom: 12,
          }}
        >
          What Our Global Clients Say
        </h2>

        <div
          style={{
            width: 40,
            height: 2,
            background:
              "linear-gradient(90deg, var(--color-brown-light), var(--color-brown-muted))",
            margin: "0 auto",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Slider Container — Proper spacing, no clipping */}
      <div
        className="max-w-5xl mx-auto"
        style={{
          overflow: "visible",
          marginBottom: "48px",
        }}
      >
        {/* Track with overflow hidden for horizontal scroll only */}
        <div
          style={{
            overflowX: "hidden",
            overflowY: "visible",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 20,
              transition: "transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: `translateX(calc(-${current} * (100% / ${cardsVisible} + ${20 / cardsVisible}px)))`,
              willChange: "transform",
            }}
          >
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="flex flex-col justify-between"
                style={{
                  flex: `0 0 calc(${100 / cardsVisible}% - ${(20 * (cardsVisible - 1)) / cardsVisible}px)`,
                  backgroundColor: "var(--color-cream-white)",
                  border: "1px solid var(--color-brown-light)",
                  borderRadius: 6,
                  boxShadow: "0 4px 12px rgba(92, 64, 51, 0.08)",
                  padding: "24px",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.5s ease ${0.1 * (i % cardsVisible) + 0.3}s, transform 0.5s ease ${0.1 * (i % cardsVisible) + 0.3}s, box-shadow 0.25s ease, border-color 0.25s ease`,
                  boxSizing: "border-box",
                  minHeight: "auto",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(92, 64, 51, 0.14)";
                  e.currentTarget.style.borderColor = "var(--color-brown-mid)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(92, 64, 51, 0.08)";
                  e.currentTarget.style.borderColor =
                    "var(--color-brown-light)";
                }}
              >
                {/* Stars */}
                <div style={{ marginBottom: 12 }}>
                  {[...Array(5)].map((_, si) => (
                    <span
                      key={si}
                      style={{
                        color: "var(--color-brown-muted)",
                        letterSpacing: 3,
                        fontSize: 13,
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Quote text */}
                <p
                  style={{
                    fontStyle: "italic",
                    flex: 1,
                    marginBottom: 16,
                    marginTop: 8,
                    color: "var(--color-text-muted)",
                    fontSize: 14,
                    lineHeight: 1.8,
                    fontFamily:
                      "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    margin: "8px 0 16px 0",
                  }}
                >
                  "{item.text}"
                </p>

                {/* Author */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: "auto",
                    paddingTop: 16,
                    borderTop: "1px solid var(--color-warm-gray)",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, var(--color-brown-light), var(--color-brown-muted))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--color-cream-white)",
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      flexShrink: 0,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                        margin: 0,
                        marginBottom: 3,
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--color-text-muted)",
                        margin: 0,
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                      }}
                    >
                      {item.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease 0.6s",
        }}
      >
        {/* Prev */}
        <button
          onClick={prev}
          disabled={current === 0}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: `1px solid ${current === 0 ? "var(--color-warm-gray)" : "var(--color-brown-mid)"}`,
            background: "var(--color-cream-white)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: current === 0 ? "default" : "pointer",
            opacity: current === 0 ? 0.4 : 1,
            transition: "all 0.22s",
          }}
          onMouseEnter={(e) => {
            if (current === 0) return;
            e.currentTarget.style.background = "var(--color-dark-brown)";
            e.currentTarget.style.borderColor = "var(--color-dark-brown)";
            e.currentTarget.querySelector("svg").style.stroke =
              "var(--color-cream-white)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-cream-white)";
            e.currentTarget.style.borderColor =
              current === 0
                ? "var(--color-warm-gray)"
                : "var(--color-brown-mid)";
            e.currentTarget.querySelector("svg").style.stroke =
              "var(--color-brown-mid)";
          }}
          aria-label="Previous"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            style={{
              width: 14,
              height: 14,
              stroke: "var(--color-brown-mid)",
              strokeWidth: 2,
              transition: "stroke 0.2s",
            }}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Dots */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {Array.from({ length: MAX_INDEX + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                height: 6,
                width: i === current ? 22 : 6,
                borderRadius: 3,
                background:
                  i === current
                    ? "var(--color-brown-mid)"
                    : "var(--color-warm-gray)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.3s, background 0.3s",
                boxShadow:
                  i === current ? "0 2px 6px rgba(92, 64, 51, 0.18)" : "none",
              }}
              aria-label={`Go to position ${i + 1}`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          disabled={current === MAX_INDEX}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: `1px solid ${current === MAX_INDEX ? "var(--color-warm-gray)" : "var(--color-brown-mid)"}`,
            background: "var(--color-cream-white)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: current === MAX_INDEX ? "default" : "pointer",
            opacity: current === MAX_INDEX ? 0.4 : 1,
            transition: "all 0.22s",
          }}
          onMouseEnter={(e) => {
            if (current === MAX_INDEX) return;
            e.currentTarget.style.background = "var(--color-dark-brown)";
            e.currentTarget.style.borderColor = "var(--color-dark-brown)";
            e.currentTarget.querySelector("svg").style.stroke =
              "var(--color-cream-white)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-cream-white)";
            e.currentTarget.style.borderColor =
              current === MAX_INDEX
                ? "var(--color-warm-gray)"
                : "var(--color-brown-mid)";
            e.currentTarget.querySelector("svg").style.stroke =
              "var(--color-brown-mid)";
          }}
          aria-label="Next"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            style={{
              width: 14,
              height: 14,
              stroke: "var(--color-brown-mid)",
              strokeWidth: 2,
              transition: "stroke 0.2s",
            }}
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
