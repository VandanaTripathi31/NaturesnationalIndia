import { useState } from "react";

const steps = [
  {
    num: "01",
    title: "Botanical Sourcing",
    desc: "Certified organic farms across India and 30+ countries.",
    icon: "🌿",
  },
  {
    num: "02",
    title: "Extraction",
    desc: "Steam distillation, cold pressing, CO₂ extraction.",
    icon: "⚗️",
  },
  {
    num: "03",
    title: "Quality Testing",
    desc: "GC/MS, COA, optical rotation — every batch.",
    icon: "🔬",
  },
  {
    num: "04",
    title: "Packaging",
    desc: "10ml to drum. Private label available.",
    icon: "📦",
  },
  {
    num: "05",
    title: "Global Dispatch",
    desc: "DHL, FedEx, sea freight to 70+ countries.",
    icon: "🌏",
  },
];

export default function ProductionProcess() {
  const [hovered, setHovered] = useState(null);

  return (
    <section
      style={{ backgroundColor: "var(--color-off-white)" }}
      className="py-16 px-4 sm:px-6"
      id="proc-sec"
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 64 }}>
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
            How We Work
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
            marginBottom: 12,
            letterSpacing: "0.01em",
          }}
        >
          Our Production Process
        </h2>

        <p
          style={{
            fontSize: 14,
            color: "var(--color-text-muted)",
            maxWidth: 480,
            margin: "6px auto 0",
            lineHeight: 1.75,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 400,
          }}
        >
          From raw botanicals to finished product — every step
          quality-controlled and documented for global compliance.
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

      {/* Steps */}
      <div className="relative max-w-5xl mx-auto">
        {/* Connector line — desktop only, sits at circle midpoint */}
        <div
          className="hidden md:block absolute z-0"
          style={{
            top: 38,
            left: "calc(10% + 38px)",
            right: "calc(10% + 38px)",
            height: 1,
            background:
              "repeating-linear-gradient(90deg, var(--color-brown-light) 0px, var(--color-brown-light) 8px, transparent 8px, transparent 18px)",
            opacity: 0.55,
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 md:gap-0 relative z-10">
          {steps.map(({ num, title, desc, icon }, i) => {
            const isHov = hovered === i;
            return (
              <div
                key={num}
                className="proc-step flex flex-col items-center text-center px-3"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "default" }}
              >
                {/* Outer glow ring — visible on hover */}
                <div
                  style={{
                    position: "relative",
                    marginBottom: 24,
                    flexShrink: 0,
                  }}
                >
                  {/* Pulsing outer ring */}
                  <div
                    style={{
                      position: "absolute",
                      inset: -8,
                      borderRadius: "50%",
                      border: `1.5px dashed ${isHov ? "var(--color-brown-light)" : "rgba(196,168,130,0.2)"}`,
                      transition: "border-color 0.35s, opacity 0.35s",
                      opacity: isHov ? 1 : 0.4,
                      animation: isHov
                        ? "spinSlow 10s linear infinite"
                        : "none",
                    }}
                  />

                  {/* Main circle */}
                  <div
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: "50%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                      background: isHov
                        ? "linear-gradient(145deg, var(--color-dark-brown), var(--color-coffee-brown))"
                        : "var(--color-cream-white)",
                      border: `2px solid ${isHov ? "var(--color-dark-brown)" : "var(--color-brown-light)"}`,
                      boxShadow: isHov
                        ? "0 8px 28px rgba(92,64,51,0.28), 0 0 0 5px rgba(196,168,130,0.15)"
                        : "0 3px 12px rgba(92,64,51,0.10)",
                      transform: isHov ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    {/* Icon — visible at rest */}
                    <span
                      style={{
                        fontSize: 22,
                        lineHeight: 1,
                        opacity: isHov ? 0 : 1,
                        position: "absolute",
                        transition: "opacity 0.2s",
                        transform: "translateY(-1px)",
                      }}
                    >
                      {icon}
                    </span>

                    {/* Step number — appears on hover */}
                    <span
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                        fontSize: 20,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        color: "var(--color-cream-white)",
                        opacity: isHov ? 1 : 0,
                        position: "absolute",
                        transition: "opacity 0.2s 0.05s",
                      }}
                    >
                      {num}
                    </span>
                  </div>

                  {/* Small step-number label below circle (always visible) */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: isHov
                        ? "var(--color-dark-brown)"
                        : "var(--color-brown-light)",
                      color: "var(--color-cream-white)",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      padding: "2px 8px",
                      borderRadius: 20,
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      whiteSpace: "nowrap",
                      transition: "background 0.3s",
                      opacity: isHov ? 0 : 1,
                    }}
                  >
                    STEP {num}
                  </div>
                </div>

                {/* Title */}
                <p
                  style={{
                    fontSize: "clamp(15px, 1.6vw, 18px)",
                    fontWeight: 600,
                    color: isHov
                      ? "var(--color-dark-brown)"
                      : "var(--color-text-primary)",
                    marginBottom: 8,
                    marginTop: 10,
                    fontFamily:
                      "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    letterSpacing: "0.01em",
                    lineHeight: 1.25,
                    transition: "color 0.25s",
                  }}
                >
                  {title}
                </p>

                {/* Animated underline */}
                <div
                  style={{
                    height: 1.5,
                    width: isHov ? 36 : 16,
                    background:
                      "linear-gradient(90deg, var(--color-brown-light), var(--color-brown-muted))",
                    margin: "0 auto 10px",
                    borderRadius: 2,
                    transition: "width 0.35s cubic-bezier(0.22,1,0.36,1)",
                  }}
                />

                {/* Desc */}
                <p
                  style={{
                    fontSize: "clamp(12px, 1.2vw, 13.5px)",
                    color: "var(--color-text-muted)",
                    lineHeight: 1.75,
                    maxWidth: 160,
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  {desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Tighten mobile gaps */
        @media (max-width: 640px) {
          #proc-sec .proc-step {
            padding-bottom: 8px;
          }
        }
      `}</style>
    </section>
  );
}
