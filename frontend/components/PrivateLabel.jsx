const aboutImage = "/images/Lab.jpg.jpeg";
const features = [
  "Custom formulation by expert chemists",
  "Private label with your brand, logo and design",
  "Packaging: 10ml to 200L barrels",
  "Glass, aluminium and HDPE containers",
  "Full documentation: COA, MSDS, GC/MS",
  "Low MOQ for startups, bulk pricing for large orders",
  "Regulatory support for USA, EU, Middle East",
];

export default function PrivateLabel({ onInquiryOpen }) {
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "var(--color-off-white)" }}
      id="bulk-sec"
    >
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* LEFT — Full image, no cropping at all */}
        <div
          className="md:w-[55%] relative flex items-center justify-center"
          style={{ backgroundColor: "var(--color-cream-white)" }}
        >
          <img
            src={aboutImage}
            alt="Private label essential oils manufacturing"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // KEY: contain = full image always visible, no crop
              objectPosition: "center",
              display: "block",
              minHeight: "400px",
            }}
          />
          {/* Soft right-edge fade blending into content panel */}
          <div
            className="hidden md:block absolute inset-y-0 right-0 w-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--color-off-white))",
            }}
          />
        </div>

        {/* RIGHT — Content panel */}
        <div
          className="md:w-[45%] relative flex flex-col justify-center px-12 py-20"
          style={{ backgroundColor: "var(--color-off-white)" }}
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
              Bulk Supplier &amp; Manufacturer
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
            className="text-[44px] font-semibold leading-[1.15] mb-5 tracking-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "var(--color-text-primary)",
            }}
          >
            Private Label &amp;
            <br />
            Contract Manufacturing
          </h2>

          {/* Gold divider */}
          <div
            className="w-10 h-[2px] rounded-full mb-6"
            style={{ backgroundColor: "var(--color-brown-mid)" }}
          />

          <p
            className="text-[13.5px] leading-[1.8] mb-8 max-w-[420px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Comprehensive private label and contract manufacturing services —
            from formulation to finished product. Launch your own essential oil
            brand.
          </p>

          <ul className="mb-10">
            {features.map((item, i) => (
              <li
                key={item}
                className={`flex items-center gap-3 py-3 text-[13.5px] ${
                  i === 0 ? "border-t" : ""
                } border-b`}
                style={{
                  borderColor: "var(--color-brown-light)",
                  color: "var(--color-text-primary)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--color-brown-mid)" }}
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onInquiryOpen}
              className="text-white text-[11px] font-bold tracking-[0.15em] uppercase px-6 py-2.5 transition-all hover:-translate-y-px"
              style={{
                backgroundColor: "var(--color-dark-brown)",
                fontFamily: "'Outfit', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(92, 64, 51, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Request OEM Quote
            </button>
            <button
              className="text-[11px] font-bold tracking-[0.15em] uppercase px-6 py-2.5 transition-all hover:-translate-y-px"
              style={{
                backgroundColor: "transparent",
                border: "1.5px solid var(--color-dark-brown)",
                color: "var(--color-text-primary)",
                fontFamily: "'Outfit', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-dark-brown)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-text-primary)";
              }}
            >
              Download Brochure
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
