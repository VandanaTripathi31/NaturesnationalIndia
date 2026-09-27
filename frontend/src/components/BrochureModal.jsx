"use client";

import { useEffect, useState } from "react";

function makeCaptcha() {
  const a = Math.ceil(Math.random() * 8);
  const b = Math.ceil(Math.random() * 8);
  return { a, b, answer: a + b };
}

export default function BrochureModal() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [email, setEmail] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState(makeCaptcha);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setClosing(false);
      setSent(false);
      setEmail("");
      setCaptchaInput("");
      setError("");
      setCaptcha(makeCaptcha());
    };
    window.addEventListener("open-brochure", handler);
    return () => window.removeEventListener("open-brochure", handler);
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 220);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleOk = () => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!validEmail) {
      setError("Please enter a valid email address.");
      return;
    }
    if (Number(captchaInput) !== captcha.answer) {
      setError("That answer doesn't look right — please try again.");
      setCaptcha(makeCaptcha());
      setCaptchaInput("");
      return;
    }
    setError("");
    // In production this should POST { email } to your backend / mailing
    // list provider (e.g. Mailchimp, HubSpot) and trigger the brochure
    // download / email send from there.
    setSent(true);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={close}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(26, 18, 8, 0.48)",
          backdropFilter: "blur(3px)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: 420,
          maxWidth: "94vw",
          backgroundColor: "var(--color-cream-white, #fff)",
          borderRadius: 6,
          boxShadow: "0 25px 70px rgba(26, 18, 8, 0.28)",
          overflow: "hidden",
          animation: closing
            ? "brochureOut 0.2s ease-in forwards"
            : "brochureIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <style>{`
          @keyframes brochureIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
          @keyframes brochureOut { to { opacity: 0; transform: scale(0.96); } }
        `}</style>

        <div
          style={{
            backgroundColor: "var(--color-dark-brown)",
            padding: "18px 22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              color: "#fff",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Natures Natural India Says
          </h3>
          <button
            onClick={close}
            aria-label="Close"
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "none",
              color: "#fff",
              width: 30,
              height: 30,
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "22px 24px 26px" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 42, marginBottom: 12 }}>📩</div>
              <h4
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 19,
                  color: "var(--color-text-primary)",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Brochure on its way!
              </h4>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                  lineHeight: 1.7,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                We've sent the product catalogue to your inbox. Keep an eye out
                for occasional offers from us too.
              </p>
              <button
                onClick={close}
                style={{
                  marginTop: 20,
                  padding: "10px 28px",
                  backgroundColor: "var(--color-dark-brown)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--color-text-primary)",
                  marginBottom: 14,
                  fontFamily: "'Outfit', sans-serif",
                  lineHeight: 1.6,
                }}
              >
                Please enter your email address to receive the product
                catalogue:
              </p>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1.5px solid var(--color-brown-light)",
                  borderRadius: 4,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13.5,
                  outline: "none",
                  marginBottom: 16,
                  boxSizing: "border-box",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    fontFamily: "'Outfit', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  What is {captcha.a} + {captcha.b}?
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  style={{
                    width: 64,
                    padding: "9px 10px",
                    border: "1.5px solid var(--color-brown-light)",
                    borderRadius: 4,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13.5,
                    outline: "none",
                    textAlign: "center",
                  }}
                />
              </div>

              {error && (
                <p
                  style={{
                    color: "#b3403a",
                    fontSize: 12.5,
                    marginBottom: 14,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {error}
                </p>
              )}

              <div
                style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
              >
                <button
                  onClick={close}
                  style={{
                    padding: "10px 22px",
                    backgroundColor: "var(--color-off-white, #f0e9dd)",
                    color: "var(--color-text-primary)",
                    border: "none",
                    borderRadius: 100,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleOk}
                  style={{
                    padding: "10px 26px",
                    backgroundColor: "var(--color-dark-brown)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 100,
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  OK
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
