"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const countries = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Canada",
  "UAE",
  "Japan",
  "Singapore",
  "India",
  "Other",
];

const productCategories = [
  "Essential Oils",
  "Carrier Oils",
  "Fragrance Oils",
  "Ayurvedic Oils",
  "Organic Oils",
  "Synergy Blends",
  "Cosmetic Butters",
  "Private Label",
];

const quantities = [
  "Sample (100ml – 500ml)",
  "1 – 10 KG",
  "10 – 50 KG",
  "50 – 200 KG",
  "200 KG+ (Bulk)",
];

const purposes = [
  "Aromatherapy",
  "Cosmetics / Skincare",
  "Pharmaceuticals",
  "Food & Beverages",
  "Candles / Soaps",
  "Private Label",
  "Resale / Distribution",
];

const inputStyle = {
  width: "100%",
  padding: "11px 13px",
  border: "1px solid var(--color-brown-light)",
  backgroundColor: "var(--color-cream-white)",
  fontFamily: "'Outfit', sans-serif",
  fontSize: "13px",
  color: "var(--color-text-primary)",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  appearance: "none",
  WebkitAppearance: "none",
  borderRadius: "3px",
};

const labelStyle = {
  display: "block",
  fontSize: "10px",
  fontWeight: 600,
  color: "var(--color-brown-muted)",
  marginBottom: "6px",
  letterSpacing: "0.4px",
  fontFamily: "'Outfit', sans-serif",
  textTransform: "uppercase",
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function StyledInput({ onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        ...inputStyle,
        borderColor: focused
          ? "var(--color-brown-mid)"
          : "var(--color-brown-light)",
        boxShadow: focused ? "0 0 0 3px rgba(196, 168, 130, 0.1)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function StyledSelect({ children, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select
        {...props}
        style={{
          ...inputStyle,
          borderColor: focused
            ? "var(--color-brown-mid)"
            : "var(--color-brown-light)",
          boxShadow: focused ? "0 0 0 3px rgba(196, 168, 130, 0.1)" : "none",
          cursor: "pointer",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {children}
      </select>
      <span
        style={{
          position: "absolute",
          right: "13px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "var(--color-brown-muted)",
          fontSize: "10px",
        }}
      >
        ▼
      </span>
    </div>
  );
}

function StyledTextarea({ ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      style={{
        ...inputStyle,
        resize: "vertical",
        minHeight: "90px",
        borderColor: focused
          ? "var(--color-brown-mid)"
          : "var(--color-brown-light)",
        boxShadow: focused ? "0 0 0 3px rgba(196, 168, 130, 0.1)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export default function InquiryWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    category: "",
    products: "",
    quantity: "",
    purpose: "",
    message: "",
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const openModal = () => {
    setOpen(true);
    setClosing(false);
    setSubmitted(false);
  };

  useEffect(() => {
    const handler = () => openModal();
    window.addEventListener("open-inquiry", handler);
    return () => window.removeEventListener("open-inquiry", handler);
  }, []);

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 260);
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.country) return;
    setSubmitted(true);

    const params = new URLSearchParams();
    params.set("name", form.name);
    if (form.email) params.set("email", form.email);
    if (form.phone) params.set("phone", form.phone);
    if (form.category) params.set("category", form.category);
    if (form.quantity) params.set("quantity", form.quantity);

    // Brief pause so the in-modal "Inquiry Sent!" confirmation is visible
    // before navigating through to the full Thank You page.
    setTimeout(() => {
      router.push(`/thank-you?${params.toString()}`);
    }, 900);
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && open) closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={openModal}
        onMouseEnter={(e) => {
          setShowTooltip(true);
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow =
            "0 12px 40px rgba(92, 64, 51, 0.45)";
        }}
        onMouseLeave={(e) => {
          setShowTooltip(false);
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 28px rgba(92, 64, 51, 0.35)";
        }}
        title="Get Free Quote"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 2000,
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          backgroundColor: "var(--color-dark-brown)",
          boxShadow: "0 8px 28px rgba(92, 64, 51, 0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: "none",
          transition: "transform 0.3s, box-shadow 0.3s",
          animation: "inquiryPulse 2.5s ease-in-out infinite",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          style={{ width: "26px", height: "26px", fill: "#fff" }}
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>

        {/* Tooltip */}
        {showTooltip && (
          <div
            style={{
              position: "absolute",
              right: "68px",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "var(--color-brown-deep)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              padding: "8px 14px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              borderRadius: "2px",
            }}
          >
            Get Free Quote
            <span
              style={{
                position: "absolute",
                left: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                borderWidth: "5px",
                borderStyle: "solid",
                borderColor: `transparent transparent transparent var(--color-brown-deep)`,
              }}
            />
          </div>
        )}
      </button>

      {/* Pulse animation */}
      <style>{`
        @keyframes inquiryPulse {
          0%,100% { box-shadow: 0 8px 28px rgba(92,64,51,0.35), 0 0 0 0 rgba(92,64,51,0.25); }
          50% { box-shadow: 0 8px 28px rgba(92,64,51,0.35), 0 0 0 12px rgba(92,64,51,0); }
        }
        @keyframes inquirySlideIn {
          from { opacity: 0; transform: translateX(40px) scale(0.97); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes inquirySlideOut {
          to { opacity: 0; transform: translateX(40px) scale(0.97); }
        }
        .inq-panel-scroll::-webkit-scrollbar { width: 5px; }
        .inq-panel-scroll::-webkit-scrollbar-track { background: var(--color-off-white); }
        .inq-panel-scroll::-webkit-scrollbar-thumb { background: var(--color-brown-light); border-radius: 3px; }
        .inq-panel-scroll::-webkit-scrollbar-thumb:hover { background: var(--color-brown-mid); }
      `}</style>

      {/* ── Modal ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1999,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "20px",
          }}
        >
          {/* Backdrop */}
          <div
            onClick={closeModal}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(26, 18, 8, 0.48)",
              backdropFilter: "blur(3px)",
            }}
          />

          {/* Panel */}
          <div
            className="inq-panel-scroll"
            style={{
              position: "relative",
              zIndex: 1,
              backgroundColor: "var(--color-cream-white)",
              width: "440px",
              maxWidth: "96vw",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 25px 70px rgba(26, 18, 8, 0.28)",
              animation: closing
                ? "inquirySlideOut 0.26s ease-in forwards"
                : "inquirySlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              borderRadius: "4px",
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: "var(--color-dark-brown)",
                padding: "22px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "20px",
                  color: "#fff",
                  fontWeight: 500,
                  margin: 0,
                  letterSpacing: "0.01em",
                }}
              >
                Send Your Inquiry
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "none",
                  color: "#fff",
                  width: "32px",
                  height: "32px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.28)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "24px 24px" }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "36px 0" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    ✅
                  </div>
                  <h4
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "21px",
                      color: "var(--color-text-primary)",
                      marginBottom: "10px",
                      fontWeight: 500,
                    }}
                  >
                    Inquiry Sent!
                  </h4>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--color-text-muted)",
                      fontFamily: "'Outfit', sans-serif",
                      lineHeight: 1.7,
                    }}
                  >
                    Thank you! Our export team will get back to you within 24
                    hours with pricing and samples.
                  </p>
                  <button
                    onClick={closeModal}
                    style={{
                      marginTop: "24px",
                      padding: "11px 32px",
                      backgroundColor: "var(--color-dark-brown)",
                      color: "#fff",
                      border: "none",
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      borderRadius: "3px",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.88";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Row 1 */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "14px",
                      marginBottom: "0",
                    }}
                  >
                    <Field label="Full Name *">
                      <StyledInput
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={set("name")}
                      />
                    </Field>
                    <Field label="Company">
                      <StyledInput
                        type="text"
                        placeholder="Company name"
                        value={form.company}
                        onChange={set("company")}
                      />
                    </Field>
                  </div>

                  {/* Row 2 */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "14px",
                    }}
                  >
                    <Field label="Email *">
                      <StyledInput
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={set("email")}
                      />
                    </Field>
                    <Field label="Phone / WhatsApp">
                      <StyledInput
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={form.phone}
                        onChange={set("phone")}
                      />
                    </Field>
                  </div>

                  {/* Row 3 */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "14px",
                    }}
                  >
                    <Field label="Country *">
                      <StyledSelect
                        value={form.country}
                        onChange={set("country")}
                      >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </StyledSelect>
                    </Field>
                    <Field label="Product Category">
                      <StyledSelect
                        value={form.category}
                        onChange={set("category")}
                      >
                        <option value="">Select Category</option>
                        {productCategories.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </StyledSelect>
                    </Field>
                  </div>

                  <Field label="Products Required">
                    <StyledInput
                      type="text"
                      placeholder="e.g. Lavender Oil, Argan Oil, Custom Blend"
                      value={form.products}
                      onChange={set("products")}
                    />
                  </Field>

                  {/* Row 4 */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "14px",
                    }}
                  >
                    <Field label="Quantity">
                      <StyledSelect
                        value={form.quantity}
                        onChange={set("quantity")}
                      >
                        <option value="">Select Quantity</option>
                        {quantities.map((q) => (
                          <option key={q}>{q}</option>
                        ))}
                      </StyledSelect>
                    </Field>
                    <Field label="Purpose">
                      <StyledSelect
                        value={form.purpose}
                        onChange={set("purpose")}
                      >
                        <option value="">Select Purpose</option>
                        {purposes.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </StyledSelect>
                    </Field>
                  </div>

                  <Field label="Message">
                    <StyledTextarea
                      placeholder="Special requirements, certifications needed, delivery timeline..."
                      value={form.message}
                      onChange={set("message")}
                    />
                  </Field>

                  <button
                    onClick={handleSubmit}
                    style={{
                      width: "100%",
                      padding: "13px",
                      backgroundColor: "var(--color-dark-brown)",
                      color: "#fff",
                      border: "none",
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      letterSpacing: "0.5px",
                      transition: "opacity 0.2s, transform 0.2s",
                      borderRadius: "3px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.88";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Send Inquiry → Get Free Quote
                  </button>
                </>
              )}
            </div>

            {/* Contact Strip */}
            {!submitted && (
              <div
                style={{
                  backgroundColor: "var(--color-off-white)",
                  padding: "14px 24px",
                  borderTop: "1px solid var(--color-warm-gray)",
                  display: "flex",
                  gap: "20px",
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <span>
                  📞{" "}
                  <a
                    href="tel:+919711003901"
                    style={{
                      color: "var(--color-brown-mid)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    +91 9711003901
                  </a>
                </span>
                <span>
                  ✉{" "}
                  <a
                    href="mailto:info@naturesnaturaliindia.com"
                    style={{
                      color: "var(--color-brown-mid)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    info@naturesnaturaliindia.com
                  </a>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
