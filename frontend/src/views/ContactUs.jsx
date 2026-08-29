"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../lib/api-client";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const faqs = [
  {
    q: "How quickly do you respond to inquiries?",
    a: "We respond to all business inquiries within 24 hours on working days. For urgent bulk order queries, our export team typically replies within a few hours. You can also reach us directly by phone for time-sensitive matters.",
  },
  {
    q: "Do you offer bulk pricing and wholesale rates?",
    a: "Yes, we have structured pricing tiers for bulk and wholesale orders. Discounts vary based on product type, quantity, and order frequency. Please fill in the contact form or email us with your requirements to receive a customised quotation.",
  },
  {
    q: "Do you ship internationally?",
    a: "Absolutely. We export to over 50 countries across Europe, North America, the Middle East, South-East Asia, and Australia. All shipments comply with international phytosanitary and customs regulations, and we handle all required export documentation.",
  },
  {
    q: "Can you provide private labelling for my brand?",
    a: "Yes. Our private label programme allows you to market our products under your brand identity. We assist with formulation, packaging design, regulatory compliance, and minimum order quantities that suit both start-ups and established brands.",
  },
];

const whyCards = [
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <rect
          width="32"
          height="32"
          rx="10"
          fill="var(--color-coffee-brown)"
          opacity=".12"
        />
        <path
          d="M10 22l4-8 4 4 3-5 3 4"
          stroke="var(--color-coffee-brown)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="22" r="1.2" fill="var(--color-coffee-brown)" />
      </svg>
    ),
    title: "Bulk Orders",
    desc: "Flexible MOQs and competitive tiered pricing for distributors, wholesalers, and large-scale buyers worldwide.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <rect
          width="32"
          height="32"
          rx="10"
          fill="var(--color-coffee-brown)"
          opacity=".12"
        />
        <circle
          cx="16"
          cy="16"
          r="7"
          stroke="var(--color-coffee-brown)"
          strokeWidth="1.8"
        />
        <path
          d="M16 9c0 0-4 3-4 7s4 7 4 7"
          stroke="var(--color-coffee-brown)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M9 16h14"
          stroke="var(--color-coffee-brown)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Worldwide Export",
    desc: "Seamless shipping to 50+ countries with full documentation, quality certificates, and customs support.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
        <rect
          width="32"
          height="32"
          rx="10"
          fill="var(--color-coffee-brown)"
          opacity=".12"
        />
        <rect
          x="9"
          y="11"
          width="14"
          height="10"
          rx="3"
          stroke="var(--color-coffee-brown)"
          strokeWidth="1.8"
        />
        <path
          d="M13 11V9.5a3 3 0 016 0V11"
          stroke="var(--color-coffee-brown)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="1.5" fill="var(--color-coffee-brown)" />
      </svg>
    ),
    title: "Private Label",
    desc: "End-to-end white-label solutions — from formulation and packaging to branding and regulatory compliance.",
  },
];

function FAQItem({ item, open, onToggle }) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--color-warm-gray)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            color: open
              ? "var(--color-coffee-brown)"
              : "var(--color-text-primary)",
            transition: "color 0.2s",
          }}
        >
          {item.q}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: open
              ? "var(--color-coffee-brown)"
              : "var(--color-soft-gray)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.25s",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            <path
              d="M2 4l4 4 4-4"
              stroke={open ? "#f8f5f2" : "var(--color-coffee-brown)"}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? "300px" : "0",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <p
          style={{
            margin: "0 0 1.25rem",
            color: "var(--color-text-muted)",
            lineHeight: 1.75,
            fontSize: "0.95rem",
          }}
        >
          {item.a}
        </p>
      </div>
    </div>
  );
}

export default function Contact() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    agree: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaUnavailable, setCaptchaUnavailable] = useState(false);

  const recaptchaRef = useRef(null);
  const widgetIdRef = useRef(null);

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const next = type === "checkbox" ? checked : value;
    setForm((f) => ({ ...f, [name]: next }));
    // Clear this field's error as soon as it holds a valid value.
    const filled = type === "checkbox" ? next : String(next).trim();
    if (filled) {
      setFieldErrors((prev) => {
        if (!prev[name]) return prev;
        const rest = { ...prev };
        delete rest[name];
        return rest;
      });
    }
  };

  // Load the reCAPTCHA script once (only when a site key is configured).
  //
  // FIX: see FloatingInquiry.jsx for the full explanation — this previously
  // had no failure path, so an ad blocker / privacy extension / network
  // filter blocking www.google.com/recaptcha/* left the widget invisible
  // and silently blocked submission forever, with no diagnostic. Same
  // bounded-timeout + onerror fix applied here.
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    if (document.querySelector("script[data-recaptcha]")) return;
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.setAttribute("data-recaptcha", "true");
    script.onerror = () => {
      console.error(
        "[reCAPTCHA] Script failed to load — likely blocked by an ad blocker, " +
          "browser privacy setting, or network filter.",
      );
      setCaptchaUnavailable(true);
    };
    document.head.appendChild(script);
  }, []);

  // Render the widget once the form (and container) are on the page.
  //
  // FIX (captcha "works once" bug): the "Send Another" button (below) flips
  // `submitted` back to false, remounting the form and a *brand new* empty
  // `<div ref={recaptchaRef} />` DOM node. The old guard —
  // `if (widgetIdRef.current === null) render()` — never re-entered the
  // render() branch on that second mount, because widgetIdRef still held
  // the id from the first (now-unmounted) widget. So the new div stayed
  // empty until a full page refresh. Now: always render() fresh into
  // whatever container exists right now, and null the ref out in the
  // effect cleanup (which runs when `submitted` flips true and the form —
  // and its div — disappears), so the next mount always takes the render()
  // path instead of silently doing nothing.
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY || submitted) return;
    let cancelled = false;
    let elapsed = 0;
    const POLL_MS = 300;
    const TIMEOUT_MS = 8000;
    const tryRender = () => {
      if (cancelled) return;
      const grecaptcha = window.grecaptcha;
      if (!grecaptcha?.render || !recaptchaRef.current) {
        elapsed += POLL_MS;
        if (elapsed >= TIMEOUT_MS) {
          console.error("[reCAPTCHA] Widget never became available after 8s.");
          setCaptchaUnavailable(true);
          return;
        }
        setTimeout(tryRender, POLL_MS);
        return;
      }
      try {
        widgetIdRef.current = grecaptcha.render(recaptchaRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          "expired-callback": () => {
            setCaptchaError("Verification expired — please complete it again.");
          },
          callback: () => setCaptchaError(""),
        });
        setCaptchaUnavailable(false);
      } catch (err) {
        console.error(
          "[reCAPTCHA] Failed to render — check that this domain is added " +
            "under the site key's allowed domains in the reCAPTCHA admin " +
            "console (google.com/recaptcha/admin):",
          err,
        );
        setCaptchaUnavailable(true);
      }
    };
    tryRender();
    return () => {
      cancelled = true;
      widgetIdRef.current = null;
    };
  }, [submitted]);

  // Per-field "this is mandatory" messages, keyed by field name. Populated
  // on submit and cleared per field as soon as the visitor fills it in.
  const REQUIRED_FIELDS = {
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    company: "Company Name",
    subject: "Subject",
    message: "Message",
    agree: "Consent",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Flag every empty mandatory field at once, each under its own input.
    const errors = {};
    for (const key of Object.keys(REQUIRED_FIELDS)) {
      const value = form[key];
      const empty = key === "agree" ? !value : !String(value ?? "").trim();
      if (empty) {
        errors[key] =
          key === "agree"
            ? "Please accept this to continue"
            : "This is mandatory field";
      }
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Require a solved captcha when reCAPTCHA is configured.
    let captchaToken = "";
    if (RECAPTCHA_SITE_KEY) {
      if (captchaUnavailable) {
        setCaptchaError(
          "Verification couldn't load — this is usually caused by an ad " +
            "blocker or browser privacy extension blocking Google reCAPTCHA. " +
            "Please disable it for this site (or try a different browser) and " +
            "retry, or reach us directly at info@naturesnaturalindia.com.",
        );
        return;
      }
      captchaToken = window.grecaptcha?.getResponse(widgetIdRef.current) ?? "";
      if (!captchaToken) {
        setCaptchaError("Please confirm you're not a robot.");
        return;
      }
    }
    setCaptchaError("");
    setSubmitError("");
    if (submitting) return;
    setSubmitting(true);

    // Persist the enquiry to the backend (same public endpoint used by the
    // global inquiry widget), then navigate to the Thank You page as soon
    // as the backend confirms. On failure the entered data is preserved so
    // the visitor can retry.
    try {
      await apiClient.post("/api/public/enquiries", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        category: form.subject,
        message: form.message,
        source: typeof window !== "undefined" ? window.location.pathname : "",
        captchaToken,
      });
    } catch (err) {
      console.error("Failed to save enquiry:", err);
      setSubmitting(false);
      // A used captcha token is rejected on retry — reset the widget.
      try {
        if (widgetIdRef.current !== null) {
          window.grecaptcha?.reset(widgetIdRef.current);
        }
      } catch {
        /* widget may already be gone */
      }
      setSubmitError(
        "Sorry, your enquiry could not be sent. Please try again, or email " +
          "us directly at info@naturesnaturalindia.com.",
      );
      return;
    }

    // Go straight to /thank-you — no interim success panel.
    // Snapshot before the reset below clears `form`.
    const details = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      category: form.subject,
    };
    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
      agree: false,
    });
    // The submitted details travel in sessionStorage, not the URL, so the
    // Thank You page stays exactly /thank-you with no personal data in the
    // address bar (or in browser history / referrer headers).
    try {
      sessionStorage.setItem("nn-enquiry-success", "1");
      sessionStorage.setItem("nn-enquiry-details", JSON.stringify(details));
    } catch {
      /* storage unavailable (private mode) — the page still renders its
         generic confirmation, just without the details summary */
    }
    router.push("/thank-you");
  };

  return (
    <div style={{ background: "var(--color-cream-white)", minHeight: "100vh" }}>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--gradient-hero)",
          position: "relative",
          overflow: "hidden",
          padding: "6rem 1.5rem 5rem",
          textAlign: "center",
        }}
      >
        {/* Decorative organic blobs */}
        <svg
          aria-hidden="true"
          width="520"
          height="520"
          viewBox="0 0 520 520"
          fill="none"
          style={{
            position: "absolute",
            top: "-160px",
            right: "-140px",
            opacity: 0.08,
            pointerEvents: "none",
          }}
        >
          <ellipse cx="260" cy="260" rx="260" ry="220" fill="#f8f5f2" />
        </svg>
        <svg
          aria-hidden="true"
          width="380"
          height="380"
          viewBox="0 0 380 380"
          fill="none"
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-100px",
            opacity: 0.06,
            pointerEvents: "none",
          }}
        >
          <ellipse cx="190" cy="190" rx="190" ry="160" fill="#f8f5f2" />
        </svg>

        {/* Glassmorphism badge */}
        <div
          style={{
            display: "inline-block",
            background: "rgba(248,245,242,0.12)",
            border: "1px solid rgba(248,245,242,0.22)",
            borderRadius: "999px",
            padding: "0.35rem 1.1rem",
            fontSize: "0.8rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-brown-light)",
            marginBottom: "1.5rem",
            backdropFilter: "blur(6px)",
          }}
        >
          Home &nbsp;/&nbsp; Contact Us
        </div>

        <h1
          className="font-playfair"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 600,
            color: "var(--color-cream-white)",
            margin: "0 0 1rem",
            lineHeight: 1.15,
          }}
        >
          Let's Start a Conversation
        </h1>
        <p
          style={{
            color: "var(--color-brown-light)",
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            maxWidth: 560,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Whether you're looking for bulk essential oils, custom formulations,
          or private label partnerships our team is ready to help your business
          grow naturally.
        </p>

        {/* Wave divider */}
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            bottom: -1,
            left: 0,
            width: "100%",
            display: "block",
          }}
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60 Q360 0 720 30 Q1080 60 1440 20 L1440 60Z"
            fill="var(--color-cream-white)"
          />
        </svg>
      </section>

      <section
        style={{ maxWidth: 1180, margin: "0 auto", padding: "4rem 1.5rem" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Left — Form */}
          <div
            style={{
              background: "#fff",
              borderRadius: 28,
              padding: "2.5rem",
              border: "1px solid var(--color-warm-gray)",
              boxShadow: "0 6px 30px rgba(92,64,51,0.08)",
            }}
          >
            <p
              style={{
                margin: "0 0 0.4rem",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-coffee-brown)",
                fontWeight: 600,
              }}
            >
              Send an Inquiry
            </p>
            <h2
              className="font-playfair"
              style={{
                margin: "0 0 2rem",
                fontSize: "1.9rem",
                fontWeight: 600,
                color: "var(--color-brown-deep)",
              }}
            >
              Tell Us About Your Needs
            </h2>

            {submitted ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "var(--color-sage-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
                    <path
                      d="M6 14l6 6L22 8"
                      stroke="var(--color-sage-dark)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  className="font-playfair"
                  style={{
                    margin: 0,
                    fontSize: "1.4rem",
                    color: "var(--color-brown-deep)",
                  }}
                >
                  Inquiry Received
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "var(--color-text-muted)",
                    lineHeight: 1.7,
                  }}
                >
                  Thank you for reaching out. Our export team will get back to
                  you within 24 hours.
                </p>
                <button
                  className="btn-secondary"
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: "0.5rem" }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.1rem",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  {[
                    {
                      name: "name",
                      label: "Full Name",
                      type: "text",
                      placeholder: "Rahul Sharma",
                    },
                    {
                      name: "email",
                      label: "Email Address",
                      type: "email",
                      placeholder: "rahul@company.com",
                    },
                    {
                      name: "phone",
                      label: "Phone Number",
                      type: "tel",
                      placeholder: "+91 98765 43210",
                    },
                    {
                      name: "company",
                      label: "Company Name",
                      type: "text",
                      placeholder: "Your Company Ltd.",
                    },
                  ].map((f) => (
                    <label
                      key={f.name}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          color: "var(--color-text-muted)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {f.label}
                      </span>
                      <input
                        type={f.type}
                        name={f.name}
                        value={form[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        required
                        style={{
                          background: "var(--color-off-white)",
                          border: "1px solid var(--color-warm-gray)",
                          borderRadius: 10,
                          padding: "0.65rem 0.9rem",
                          fontSize: "0.93rem",
                          color: "var(--color-text-primary)",
                          outline: "none",
                          transition: "border-color 0.18s",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor =
                            "var(--color-coffee-brown)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor =
                            "var(--color-warm-gray)")
                        }
                      />
                      {fieldErrors[f.name] && (
                        <span
                          role="alert"
                          style={{
                            fontSize: "0.8rem",
                            color: "#b91c1c",
                            lineHeight: 1.4,
                          }}
                        >
                          {fieldErrors[f.name]}
                        </span>
                      )}
                    </label>
                  ))}
                </div>

                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: "var(--color-text-muted)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Subject
                  </span>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    style={{
                      background: "var(--color-off-white)",
                      border: "1px solid var(--color-warm-gray)",
                      borderRadius: 10,
                      padding: "0.65rem 0.9rem",
                      fontSize: "0.93rem",
                      color: form.subject
                        ? "var(--color-text-primary)"
                        : "var(--color-text-muted)",
                      outline: "none",
                      transition: "border-color 0.18s",
                      appearance: "none",
                      cursor: "pointer",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--color-coffee-brown)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--color-warm-gray)")
                    }
                  >
                    <option value="" disabled>
                      Select a topic…
                    </option>
                    <option value="bulk">Bulk / Wholesale Order</option>
                    <option value="private">Private Label Inquiry</option>
                    <option value="sample">Request a Sample</option>
                    <option value="export">Export Documentation</option>
                    <option value="custom">Custom Formulation</option>
                    <option value="other">Other</option>
                  </select>
                  {fieldErrors.subject && (
                    <span
                      role="alert"
                      style={{
                        fontSize: "0.8rem",
                        color: "#b91c1c",
                        lineHeight: 1.4,
                      }}
                    >
                      {fieldErrors.subject}
                    </span>
                  )}
                </label>

                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: "var(--color-text-muted)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Message
                  </span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your product requirements, quantities, or any specific requests…"
                    required
                    style={{
                      background: "var(--color-off-white)",
                      border: "1px solid var(--color-warm-gray)",
                      borderRadius: 10,
                      padding: "0.65rem 0.9rem",
                      fontSize: "0.93rem",
                      color: "var(--color-text-primary)",
                      outline: "none",
                      resize: "vertical",
                      lineHeight: 1.6,
                      transition: "border-color 0.18s",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--color-coffee-brown)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--color-warm-gray)")
                    }
                  />
                  {fieldErrors.message && (
                    <span
                      role="alert"
                      style={{
                        fontSize: "0.8rem",
                        color: "#b91c1c",
                        lineHeight: 1.4,
                      }}
                    >
                      {fieldErrors.message}
                    </span>
                  )}
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={handleChange}
                    required
                    style={{
                      marginTop: 3,
                      accentColor: "var(--color-coffee-brown)",
                      width: 16,
                      height: 16,
                      cursor: "pointer",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.84rem",
                      color: "var(--color-text-muted)",
                      lineHeight: 1.55,
                    }}
                  >
                    I agree to be contacted by Nature's Natural India regarding
                    my inquiry and understand my data will be kept confidential.
                  </span>
                </label>
                {fieldErrors.agree && (
                  <span
                    role="alert"
                    style={{
                      fontSize: "0.8rem",
                      color: "#b91c1c",
                      lineHeight: 1.4,
                    }}
                  >
                    {fieldErrors.agree}
                  </span>
                )}

                {RECAPTCHA_SITE_KEY && (
                  <div>
                    <div ref={recaptchaRef} />
                    {captchaError && (
                      <p
                        style={{
                          marginTop: "0.4rem",
                          fontSize: "0.8rem",
                          color: "#b91c1c",
                        }}
                      >
                        {captchaError}
                      </p>
                    )}
                  </div>
                )}

                {submitError && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.84rem",
                      color: "#b91c1c",
                      lineHeight: 1.55,
                    }}
                  >
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.97rem",
                    cursor: submitting ? "wait" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? "Sending…" : "Send Inquiry"}
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 16 16"
                    style={{ marginLeft: 8 }}
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            )}
          </div>

          {/* Right — Company Card */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div
              style={{
                background: "var(--gradient-hero)",
                borderRadius: 28,
                padding: "2.5rem",
                color: "var(--color-cream-white)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <svg
                aria-hidden="true"
                width="260"
                height="260"
                viewBox="0 0 260 260"
                fill="none"
                style={{
                  position: "absolute",
                  top: -60,
                  right: -60,
                  opacity: 0.08,
                  pointerEvents: "none",
                }}
              >
                <circle cx="130" cy="130" r="130" fill="#f8f5f2" />
              </svg>

              <p
                style={{
                  margin: "0 0 0.4rem",
                  fontSize: "0.7rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-brown-light)",
                  fontWeight: 600,
                }}
              >
                About Us
              </p>
              <h3
                className="font-playfair"
                style={{
                  margin: "0 0 1rem",
                  fontSize: "1.55rem",
                  fontWeight: 600,
                  lineHeight: 1.25,
                }}
              >
                Nature's Natural India
              </h3>
              <p
                style={{
                  margin: "0 0 1.75rem",
                  color: "var(--color-brown-light)",
                  fontSize: "0.91rem",
                  lineHeight: 1.75,
                }}
              >
                A trusted manufacturer and exporter of pure essential oils,
                carrier oils, and botanical extracts since 2005. Our
                distillation units in Kannauj — the perfume capital of India —
                combine ancestral craft with modern GMP-certified processes.
              </p>

              {[
                {
                  label: "Address",
                  value:
                    "Plot No. B 45/7, Site-4, Industrial Area, Sahibabad, Ghaziabad-201010 (UP) India",
                },
                { label: "Phone", value: "+91 9711-003-901" },
                { label: "Email", value: "info@naturesnaturalindia.com" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    marginBottom: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid rgba(248,245,242,0.12)",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 0.2rem",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-brown-light)",
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      color: "var(--color-cream-white)",
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "1.5rem",
                border: "1px solid var(--color-warm-gray)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              {[
                { num: "18+", label: "Years of Export" },
                { num: "50+", label: "Countries Served" },
                { num: "300+", label: "Products Offered" },
                { num: "ISO", label: "9001:2015 Certified" },
              ].map(({ num, label }) => (
                <div
                  key={label}
                  style={{
                    background: "var(--color-off-white)",
                    borderRadius: 14,
                    padding: "1rem",
                    textAlign: "center",
                    border: "1px solid var(--color-warm-gray)",
                  }}
                >
                  <p
                    className="font-playfair"
                    style={{
                      margin: "0 0 0.2rem",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "var(--color-coffee-brown)",
                    }}
                  >
                    {num}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.78rem",
                      color: "var(--color-text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Support badges */}
            <div
              style={{
                background: "var(--color-sage-light)",
                borderRadius: 20,
                padding: "1.25rem 1.5rem",
                border: "1px solid #cce4c9",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {[
                "✓ Bulk & Wholesale Orders Welcome",
                "✓ Private Label & White-Label Solutions",
                "✓ Global Shipping & Full Documentation",
                "✓ GMP · ISO Certified · MSDS Available",
              ].map((item) => (
                <p
                  key={item}
                  style={{
                    margin: 0,
                    fontSize: "0.88rem",
                    color: "var(--color-sage-dark)",
                    fontWeight: 500,
                  }}
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Map ─────────────────────────────────────────── */}
      <section
        style={{ maxWidth: 1180, margin: "0 auto", padding: "5rem 1.5rem" }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: "0 10px 50px rgba(92,64,51,0.12)",
          }}
        >
          <iframe
            title="Nature's Natural India Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14314.245!2d79.92!3d27.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399f7e9b3bae9f3b%3A0x1!2sKannauj%2C+Uttar+Pradesh!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="420"
            style={{
              border: "none",
              display: "block",
              filter: "saturate(0.8) contrast(0.95)",
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* Overlay card — now a clickable link to Google Maps */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Plot+No.+B+45%2F8%2C+Site-4%2C+Industrial+Area%2C+Sahibabad%2C+Ghaziabad-201010+UP+India"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              background: "rgba(255,255,255,0.94)",
              backdropFilter: "blur(10px)",
              borderRadius: 16,
              padding: "1.1rem 1.4rem",
              boxShadow: "0 6px 24px rgba(92,64,51,0.14)",
              border: "1px solid var(--color-warm-gray)",
              maxWidth: 260,
              textDecoration: "none",
              cursor: "pointer",
              display: "block",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 10px 32px rgba(92,64,51,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 24px rgba(92,64,51,0.14)";
            }}
          >
            <p
              style={{
                margin: "0 0 0.3rem",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-coffee-brown)",
                fontWeight: 700,
              }}
            >
              Manufacturing Unit
            </p>
            <p
              style={{
                margin: "0 0 0.6rem",
                fontSize: "0.88rem",
                color: "var(--color-text-primary)",
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              Plot No. B 45/7, Site-4, Industrial Area
              <br />
              Sahibabad, Ghaziabad-201010 (UP) India
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--color-coffee-brown)",
              }}
            >
              Get Directions
              <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
                <path
                  d="M2 6h8M6 2l4 4-4 4"
                  stroke="var(--color-coffee-brown)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
