"use client";

const NUMBER = "919711003901";
const MESSAGE = "Hello, I have a question about your products.";

export default function WhatsAppButton() {
  if (!NUMBER) return null;

  const href = `https://wa.me/${NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        // Bottom-right corner, stacked above the inquiry (bottom:28) and
        // back-to-top (bottom:98) buttons so none overlap.
        position: "fixed",
        right: "28px",
        bottom: "168px",
        zIndex: 900,
        display: "flex",
        alignItems: "center",
        gap: "0px",
        padding: "6px 26px 6px 6px",
        borderRadius: "9999px",
        background: "linear-gradient(135deg, #2fce5a 0%, #25b350 100%)",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.22)",
        textDecoration: "none",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.04)";
        e.currentTarget.style.boxShadow = "0 8px 26px rgba(0, 0, 0, 0.28)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.22)";
      }}
    >
      {/* Icon bubble - white ring, green fill, speech-bubble tail */}
      <span
        style={{
          flexShrink: 0,
          position: "relative",
          width: "54px",
          height: "54px",
          marginRight: "14px",
          filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.25))",
        }}
      >
        <svg width="54" height="54" viewBox="0 0 58 58">
          {/* White speech-bubble backing shape (circle + small tail) */}
          <path
            d="M29 2C14.09 2 2 14.09 2 29c0 4.72 1.22 9.15 3.36 13.01L2 56l14.32-3.28A26.86 26.86 0 0029 56c14.91 0 27-12.09 27-27S43.91 2 29 2z"
            fill="#ffffff"
          />
          {/* Green circle */}
          <circle cx="29" cy="27.5" r="21.5" fill="url(#wa-grad)" />
          <defs>
            <linearGradient id="wa-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3fd66b" />
              <stop offset="100%" stopColor="#22b34d" />
            </linearGradient>
          </defs>
          {/* Phone handset icon */}
          <path
            transform="translate(15, 13.5) scale(1.15)"
            fill="#ffffff"
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
          />
        </svg>
      </span>

      {/* Text stack */}
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "20px",
            letterSpacing: "0.2px",
          }}
        >
          WhatsApp
        </span>
        <span
          style={{
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "14px",
            opacity: 0.95,
          }}
        >
          Chat to Expert
        </span>
      </span>
    </a>
  );
}
