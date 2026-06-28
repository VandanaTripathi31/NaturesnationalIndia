const marqueeItems = [
  "100% Pure & Natural",
  "GC/MS Tested Every Batch",
  "ISO 9001:2015",
  "WHO-GMP Certified",
  "HALAL & KOSHER Certified",
  "Free Samples Available",
  "Worldwide DHL / FedEx Shipping",
  "Custom Blending",
  "Private Label Ready",
  "Bulk & Wholesale Supply",
];

export const Marquee = () => {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@500;600&display=swap');

        .mq-track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: mqScroll 38s linear infinite;
          padding: 0;
          will-change: transform;
        }
        @keyframes mqScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mq-track { animation: none; }
        }

        .mq-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 9px 22px;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-brown-light);
          transition: color 0.2s;
        }

        .mq-diamond {
          display: inline-block;
          width: 4px;
          height: 4px;
          background: var(--color-brown-muted);
          transform: rotate(45deg);
          flex-shrink: 0;
          opacity: 0.80;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          zIndex: 998,
          overflow: "hidden",
          /* Dark banner uses --color-brown-deep — the deepest token */
          background: "var(--color-brown-deep)",
          borderTop: "1px solid rgba(196,168,130,0.14)",
          borderBottom: "1px solid rgba(196,168,130,0.14)",
        }}
      >
        {/* Left fade mask */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 80,
            /* Fade uses the same deep-brown to blend cleanly */
            background:
              "linear-gradient(to right, var(--color-brown-deep), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {/* Right fade mask */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 80,
            background:
              "linear-gradient(to left, var(--color-brown-deep), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div className="mq-track">
          {items.map((text, i) => (
            <span key={i} className="mq-item">
              <span className="mq-diamond" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};
