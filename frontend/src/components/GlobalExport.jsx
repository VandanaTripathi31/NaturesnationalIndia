const map = "/images/map.jpeg";
import { Globe, Users, Package, Clock } from "lucide-react";
const countries = [
  { name: "USA", code: "us" },
  { name: "UK", code: "gb" },
  { name: "Germany", code: "de" },
  { name: "France", code: "fr" },
  { name: "Australia", code: "au" },
  { name: "Canada", code: "ca" },
  { name: "UAE", code: "ae" },
  { name: "Japan", code: "jp" },
  { name: "Netherlands", code: "nl" },
  { name: "Singapore", code: "sg" },
  { name: "Saudi Arabia", code: "sa" },
  { name: "New Zealand", code: "nz" },
  { name: "Italy", code: "it" },
  { name: "Brazil", code: "br" },
  { name: "Malaysia", code: "my" },
  { name: "South Africa", code: "za" },
];

const stats = [
  { number: "15,000+", label: "Active B2B Clients", icon: Users },
  { number: "70+", label: "Countries Served", icon: Globe },
  { number: "500+", label: "Product Varieties", icon: Package },
  { number: "15+", label: "Years in Business", icon: Clock },
];

export default function GlobalExport() {
  return (
    <section
      id="global-sec"
      className="relative overflow-hidden py-20 px-6"
      style={{ backgroundColor: "var(--color-brown-deep)" }}
    >
      {/* MAP IMAGE */}
      <img
        src={map}
        alt="World map"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.22, mixBlendMode: "luminosity" }}
      />

      {/* Warm overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,10,4,0.50) 0%, rgba(20,10,4,0.28) 50%, rgba(20,10,4,0.60) 100%)",
        }}
      />

      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "2px",
          background:
            "linear-gradient(90deg, var(--color-brown-muted), var(--color-brown-light), var(--color-brown-muted))",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.05,
          backgroundImage:
            "radial-gradient(circle, var(--color-brown-light) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* HEADER — site-wide pattern */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
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
              Worldwide Reach
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
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 600,
              color: "var(--color-cream-white)",
              letterSpacing: "0.02em",
              marginBottom: 14,
            }}
          >
            Global{" "}
            <em
              style={{ color: "var(--color-brown-light)", fontStyle: "italic" }}
            >
              Exports
            </em>
          </h2>

          <div
            style={{
              width: 40,
              height: 2,
              background:
                "linear-gradient(90deg, var(--color-brown-muted), var(--color-brown-light))",
              margin: "0 auto 16px",
              borderRadius: 2,
            }}
          />

          <p
            style={{
              color: "var(--color-brown-light)",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: 1.8,
              maxWidth: 560,
              margin: "0 auto",
              opacity: 0.88,
            }}
          >
            From Sahibabad, Ghaziabad we export to aromatherapy brands, cosmetic
            manufacturers, pharmaceutical companies and wellness retailers
            worldwide — with full compliance documentation and reliable
            delivery.
          </p>
        </div>

        {/* COUNTRY GRID */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mb-12">
          {countries.map((c) => (
            <div
              key={c.name}
              className="flex flex-col items-center justify-center gap-2 py-3 px-2 cursor-default transition-all duration-300"
              style={{
                background: "rgba(196,168,130,0.06)",
                border: "1px solid rgba(196,168,130,0.16)",
                borderRadius: 3,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(196,168,130,0.14)";
                e.currentTarget.style.borderColor = "rgba(196,168,130,0.50)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(62,43,30,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(196,168,130,0.06)";
                e.currentTarget.style.borderColor = "rgba(196,168,130,0.16)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <img
                src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icons/7.2.3/flags/4x3/${c.code}.svg`}
                alt={`${c.name} flag`}
                style={{
                  width: 36,
                  height: 24,
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
                  display: "block",
                }}
                loading="lazy"
              />
              <span
                style={{
                  color: "var(--color-brown-light)",
                  fontSize: 10,
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  textAlign: "center",
                  lineHeight: 1.3,
                  opacity: 0.85,
                }}
              >
                {c.name}
              </span>
            </div>
          ))}
        </div>

        {/* STATS BAR */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ borderTop: "1px solid rgba(196,168,130,0.15)" }}
        >
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="flex flex-col items-start py-7 px-6"
                style={{ borderRight: "1px solid rgba(196,168,130,0.10)" }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "rgba(196,168,130,0.10)",
                    border: "1px solid rgba(196,168,130,0.28)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Icon
                    size={16}
                    color="var(--color-brown-light)"
                    strokeWidth={1.5}
                  />
                </div>

                <span
                  style={{
                    display: "block",
                    fontFamily:
                      "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                    fontWeight: 600,
                    color: "var(--color-brown-light)",
                    lineHeight: 1,
                    marginBottom: 6,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {s.number}
                </span>

                <span
                  style={{
                    color: "rgba(196,168,130,0.70)",
                    fontSize: 10,
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
