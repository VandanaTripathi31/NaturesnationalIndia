"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const logo = "/images/logo1.png";

/* ─── TOP BAR ──────────────────────────────────────────────────────────── */
const TopBar = ({ scrolled, onOpenInquiry }) => (
  <div
    style={{
      background: "var(--color-brown-deep)",
      borderBottom: "1px solid rgba(196,168,130,0.15)",
      overflow: "hidden",
      maxHeight: scrolled ? "0px" : "40px",
      transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
    }}
  >
    <div className="flex justify-between items-center flex-wrap gap-[6px] px-4 sm:px-6 lg:px-10 py-[9px]">
      {/* Left */}
      <div className="flex gap-[18px] sm:gap-[26px] flex-wrap items-center">
        {[
          { icon: "📞", text: "+91 9711003901", href: "tel:+919711003901" },
          {
            icon: "✉",
            text: "info@naturesnaturalindia.com",
            href: "mailto:info@naturesnaturalindia.com",
          },
          {
            icon: "📍",
            text: "Sahibabad, Ghaziabad, UP India",
            href: null,
            cls: "hidden sm:flex",
          },
        ].map(({ icon, text, href, cls = "flex" }) =>
          href ? (
            <a
              key={text}
              href={href}
              className={`${cls} items-center gap-[5px]`}
              style={{
                color: "var(--color-brown-light)",
                fontSize: 12,
                fontWeight: 500,
                textDecoration: "none",
                letterSpacing: "0.01em",
                transition: "color 0.18s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-cream-white)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-brown-light)")
              }
            >
              <span style={{ fontSize: 12 }}>{icon}</span> {text}
            </a>
          ) : (
            <span
              key={text}
              className={`${cls} items-center gap-[5px]`}
              style={{
                color: "var(--color-brown-light)",
                fontSize: 12,
                letterSpacing: "0.01em",
              }}
            >
              <span style={{ fontSize: 12 }}>{icon}</span> {text}
            </span>
          ),
        )}
      </div>

      {/* Right */}
      <div className="hidden sm:flex gap-[20px] flex-wrap items-center">
        {["Dealer Inquiry", "Private Label", "Free Sample"].map((t) => (
          <a
            key={t}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenInquiry?.();
            }}
            style={{
              color: "var(--color-brown-light)",
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              paddingBottom: 2,
              borderBottom: "1px solid transparent",
              transition: "color 0.15s, border-color 0.15s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-cream-white)";
              e.currentTarget.style.borderBottomColor =
                "rgba(196,168,130,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-brown-light)";
              e.currentTarget.style.borderBottomColor = "transparent";
            }}
          >
            {t}
          </a>
        ))}
        {/* Divider */}
        <span
          style={{
            width: 1,
            height: 14,
            background: "rgba(196,168,130,0.3)",
            display: "inline-block",
          }}
        />
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onOpenInquiry?.();
          }}
          style={{
            color: "var(--color-cream-white)",
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            background: "rgba(196,168,130,0.18)",
            padding: "3px 10px",
            borderRadius: 3,
            border: "1px solid rgba(196,168,130,0.3)",
            transition: "background 0.18s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(196,168,130,0.32)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(196,168,130,0.18)")
          }
        >
          Register
        </a>
      </div>
    </div>
  </div>
);

/* ─── MEGA MENU ────────────────────────────────────────────────────────── */
const MegaMenu = ({ sections, tags }) => (
  <div
    className="hidden group-hover:block absolute top-full left-1/2 z-[999]"
    style={{
      transform: "translateX(-50%)",
      background: "#fff",
      border: "1px solid rgba(196,168,130,0.25)",
      borderTop: "3px solid var(--color-brown-light)",
      boxShadow: "0 20px 50px rgba(62,43,30,0.14)",
      minWidth: 680,
      padding: "28px 32px",
      display: "none",
    }}
  >
    <style>{`.group:hover .mega-show { display: flex !important; }`}</style>
    <div
      className="mega-show"
      style={{ gap: 32, flexWrap: "wrap", display: "none" }}
    >
      {sections.map((sec, si) => (
        <div key={si} style={{ minWidth: 150 }}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-brown-muted, #8B6650)",
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: "1px solid rgba(196,168,130,0.3)",
            }}
          >
            {sec.title}
          </div>
          {sec.items.map((item, i) => (
            <a
              key={i}
              href="#"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 13,
                color: "var(--color-text-muted)",
                padding: "6px 0",
                textDecoration: "none",
                fontWeight: 400,
                transition: "color 0.15s, transform 0.15s",
                borderBottom: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-dark-brown)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-muted)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--color-brown-light)",
                  flexShrink: 0,
                  opacity: 0.7,
                }}
              />
              {item}
            </a>
          ))}
        </div>
      ))}
    </div>
    {tags && (
      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: "1px solid rgba(196,168,130,0.2)",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-brown-muted)",
              background: "rgba(196,168,130,0.1)",
              border: "1px solid rgba(196,168,130,0.3)",
              padding: "4px 14px",
              borderRadius: 100,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(196,168,130,0.24)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(196,168,130,0.1)")
            }
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

/* ─── SIMPLE DROPDOWN ──────────────────────────────────────────────────── */
const DropdownMenu = ({ items }) => (
  <div
    className="hidden group-hover:block absolute top-full left-0 z-[999]"
    style={{
      background: "#fff",
      border: "1px solid rgba(196,168,130,0.22)",
      borderTop: "3px solid var(--color-brown-light)",
      boxShadow: "0 16px 40px rgba(62,43,30,0.12)",
      minWidth: 210,
    }}
  >
    {items.map((item, i) => {
      const href = typeof item === "object" ? item.href : "#";
      const label = typeof item === "object" ? item.label : item;
      const style = {
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        color: "var(--color-text-muted)",
        padding: "10px 18px",
        borderBottom:
          i < items.length - 1 ? "1px solid rgba(196,168,130,0.15)" : "none",
        textDecoration: "none",
        fontWeight: 400,
        transition: "background 0.15s, color 0.15s, padding-left 0.18s",
      };

      if (href && href.startsWith("/")) {
        return (
          <Link
            key={i}
            href={href}
            style={style}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#faf8f5";
              e.currentTarget.style.color = "var(--color-dark-brown)";
              e.currentTarget.style.paddingLeft = "24px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-muted)";
              e.currentTarget.style.paddingLeft = "18px";
            }}
          >
            {label}
          </Link>
        );
      }

      return (
        <a
          key={i}
          href={href || "#"}
          style={style}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#faf8f5";
            e.currentTarget.style.color = "var(--color-dark-brown)";
            e.currentTarget.style.paddingLeft = "24px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--color-text-muted)";
            e.currentTarget.style.paddingLeft = "18px";
          }}
        >
          {label}
        </a>
      );
    })}
  </div>
);
/* ─── NAV ITEM ─────────────────────────────────────────────────────────── */
const NavItem = ({ label, items, href, scrolled }) => {
  const height = scrolled ? "60px" : "76px";
  const linkStyle = {
    fontSize: 13.5,
    fontWeight: 600,
    letterSpacing: "0.04em",
    display: "flex",
    alignItems: "center",
    gap: 4,
    whiteSpace: "nowrap",
    height,
    padding: "0 13px",
    color: "var(--color-text-primary)",
    textDecoration: "none",
    borderBottom: "2px solid transparent",
    transition: "color 0.2s, border-color 0.2s, height 0.35s",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  };

  const labelContent = (
    <>
      {label}
      {items?.length > 0 && (
        <svg
          width="9"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ marginTop: 1, opacity: 0.55 }}
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      )}
    </>
  );

  return (
    <div className="relative group">
      {href && href.startsWith("/") ? (
        <Link
          href={href}
          style={linkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-dark-brown)";
            e.currentTarget.style.borderBottomColor =
              "var(--color-brown-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-primary)";
            e.currentTarget.style.borderBottomColor = "transparent";
          }}
        >
          {labelContent}
        </Link>
      ) : (
        <a
          href={href || "#"}
          style={linkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-dark-brown)";
            e.currentTarget.style.borderBottomColor =
              "var(--color-brown-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-primary)";
            e.currentTarget.style.borderBottomColor = "transparent";
          }}
        >
          {labelContent}
        </a>
      )}
      {(items || []).length > 0 && items && <DropdownMenu items={items} />}
    </div>
  );
};

/* ─── DATA: Menu Items from NavbarA ────────────────────────────────────── */
const OilsMegaSections = [
  {
    title: "Core Range",
    items: [
      "Essential Oils",
      "Carrier Oils",
      "Fragrance Oils",
      "Ayurvedic Herbal Oil",
      "Hydrosols / Floral Water",
      "Diffuser Oil",
    ],
  },
  {
    title: "Organic & Pure",
    items: [
      "Organic Essential Oil",
      "Organic Carrier Oil",
      "Certified Organic Oils",
      "Absolute Oils",
      "CO2 Oils",
      "Oleoresins Oils",
    ],
  },
  {
    title: "Specialty",
    items: [
      "Indian Attars",
      "Synergy Blends",
      "Seven Chakra Blends",
      "3% Exotic Dilution",
      "Spice Oils",
      "Aromatic Chemicals",
    ],
  },
  {
    title: "Extracts & More",
    items: [
      "Liquid Herbal Extracts",
      "Peppermint Products",
      "Cosmetic Butters",
    ],
  },
];

const staticNavItems = [
  {
    label: "About Us",
    href: "/about-us",
    items: [
      { label: "Our Offices", href: "/our-offices" },
      { label: "Policies", href: "/policies" },
      { label: "Certificate", href: "/our-certification" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  {
    label: "Distillation",
    items: [
      { label: "Steam Distillation", href: "/steam-distillation" },
      { label: "Cold Pressing", href: "/cold-pressing" },
      { label: "Solvent Extraction", href: "/solvent-extraction" },
    ],
  },
  {
    label: "Private Label",
    items: [
      { label: "Bulk Orders", href: "/bulk-orders" },
      { label: "Private Labelling", href: "/private-labelling" },
      { label: "Custom Blends", href: "/custom-blends" },
      { label: "Wholesale", href: "/wholesale" },
      { label: "Secure Shopping", href: "/secure-shopping" },
    ],
  },
  {
    label: "Packaging",
    items: [
      { label: "Barrel Packaging", href: "/barrel-packaging" },
      { label: "Private Packaging", href: "/private-packaging" },
    ],
  },
  { label: "Shipping", href: "/delivery-info" },
  { label: "Quality Assurance", href: "/quality-assurance" },
];

/* ─── MOBILE SECTION ───────────────────────────────────────────────────── */
const MobileSection = ({ title, items, allSections }) => {
  const [open, setOpen] = useState(false);
  const allItems = allSections
    ? allSections.flatMap((s) => s.items)
    : items || [];

  return (
    <div style={{ borderBottom: "0.5px solid rgba(196,168,130,0.18)" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "13px 16px",
          fontSize: 13.5,
          fontWeight: 600,
          color: "#4a3829",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          transition: "background 0.15s",
        }}
      >
        {title}
        <span
          style={{
            color: "var(--color-brown-muted)",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
            fontSize: 11,
          }}
        >
          ▾
        </span>
      </button>

      <div
        style={{
          maxHeight: open ? `${allItems.length * 40}px` : "0px",
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
          background: "#faf8f5",
        }}
      >
        {allItems.map((item, i) => {
          const href = typeof item === "object" ? item.href : "#";
          const label = typeof item === "object" ? item.label : item;
          const style = {
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 28px",
            fontSize: 12.5,
            color: "var(--color-text-muted)",
            borderBottom: "0.5px solid rgba(196,168,130,0.12)",
            textDecoration: "none",
            transition: "color 0.15s, padding-left 0.18s",
          };

          const dot = (
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "var(--color-brown-light)",
                flexShrink: 0,
              }}
            />
          );

          if (href && href.startsWith("/")) {
            return (
              <Link key={i} href={href} style={style}>
                {dot}
                {label}
              </Link>
            );
          }

          return (
            <a key={i} href={href || "#"} style={style}>
              {dot}
              {label}
            </a>
          );
        })}
      </div>
    </div>
  );
};

/* ─── TRUST BADGES ─────────────────────────────────────────────────────── */
const TrustBadges = ({ scrolled }) => (
  <div
    style={{
      background: "var(--color-cream-white, #faf8f5)",
      borderBottom: "1px solid rgba(196,168,130,0.2)",
      overflow: "hidden",
      maxHeight: scrolled ? "0px" : "36px",
      transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
    }}
  >
    <div
      className="flex justify-center items-center gap-[28px] sm:gap-[44px] flex-wrap px-4"
      style={{ height: 36 }}
    >
      {[
        "🌿 100% Pure & Natural",
        "🔬 GC/MS Tested",
        "🚢 Global Export",
        "📦 Bulk & Wholesale",
        "✅ ISO Certified",
      ].map((badge) => (
        <span
          key={badge}
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.07em",
            color: "var(--color-brown-muted, #8B6650)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </span>
      ))}
    </div>
  </div>
);

/* ─── MAIN NAVBAR ──────────────────────────────────────────────────────── */
const Navbar = ({ onOpenInquiry, categories = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const oilsItems = categories.map((category) => ({
    label: category.name,
    href: `/category/${category.slug}`,
  }));

  const navItems = [
    {
      label: "Oils",
      items:
        oilsItems.length > 0
          ? oilsItems
          : [{ label: "Browse categories", href: "/" }],
    },
    ...staticNavItems,
  ];

  useEffect(() => {
    // Hysteresis prevents the header/logo from rapidly flipping size when
    // scrollY hovers right around a single threshold (the "dancing" logo
    // issue). It only switches to "scrolled" mode once past 80px, and only
    // switches back once back under 40px, so small jitters near one value
    // can't cause repeated toggling.
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => {
        if (!prev && y > 80) return true;
        if (prev && y < 40) return false;
        return prev;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerHeight = scrolled ? "60px" : "80px";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        .group:hover .group-hover\\:block {
          display: block !important;
        }

        .nb-cta-btn {
          background: var(--gradient-btn, linear-gradient(135deg, #5C3D2E 0%, #8B6344 100%));
          color: var(--color-cream-white) !important;
          border: none;
          border-radius: 100px;
          padding: 10px 24px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none !important;
          box-shadow: 0 3px 14px rgba(92,64,51,0.30);
          transition: box-shadow 0.2s, transform 0.18s, background 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .nb-cta-btn:hover {
          background: var(--gradient-btn-hover, linear-gradient(135deg, #8B6344 0%, #5C3D2E 100%));
          box-shadow: 0 6px 22px rgba(92,64,51,0.42);
          transform: translateY(-2px);
        }
        .nb-cta-btn:active {
          transform: translateY(0);
        }
        .nb-cta-btn svg {
          transition: transform 0.2s;
        }
        .nb-cta-btn:hover svg {
          transform: translateX(3px);
        }

        .nb-logo-img {
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s;
        }
        .nb-logo-img:hover {
          transform: scale(1.05) !important;
          filter: contrast(1.2) brightness(1.08) !important;
        }

        /* Mobile drawer slide */
        @keyframes drawerIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nb-mobile-drawer {
          animation: drawerIn 0.22s ease forwards;
        }
      `}</style>

      {/*
        FIX: TopBar + TrustBadges + header are now wrapped together in a single
        sticky, position:relative container. Previously the mobile drawer used
        position:fixed with a hardcoded "top: scrolled ? 60 : 80", which ignored
        the extra height added by TopBar (40px) + TrustBadges (36px) above the
        header when the page hadn't scrolled yet. That caused the drawer to
        render at the wrong vertical offset and visually collide with the
        header/badges (the UI issue in the screenshot).

        By making this wrapper the positioning context (position: relative)
        and placing the drawer at position: absolute; top: 100%, the drawer
        now always sits flush against the actual bottom of the header,
        regardless of scroll state or badge visibility — no manual pixel
        math needed.
      */}
      <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
        <div style={{ position: "relative" }}>
          <TopBar scrolled={scrolled} onOpenInquiry={onOpenInquiry} />
          <TrustBadges scrolled={scrolled} />

          <header
            style={{
              background: scrolled
                ? "rgba(255,255,255,0.98)"
                : "var(--color-cream-white, #faf8f5)",
              borderBottom: "1px solid rgba(196,168,130,0.22)",
              boxShadow: scrolled
                ? "0 4px 28px rgba(62,43,30,0.11)"
                : "0 2px 14px rgba(62,43,30,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px 0 24px",
              height: headerHeight,
              transition:
                "height 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s, background 0.35s",
              backdropFilter: scrolled ? "blur(8px)" : "none",
            }}
          >
            {/* ── LOGO ──
              FIX: the logo used to shrink by animating the <img>'s `width`
              (250px -> 140px) on scroll. Animating width is a layout
              property, so the browser had to reflow the header on every
              frame of the transition, which is what produced the visible
              "shift/jump" of the logo (and any jitter in the nav/CTA next
              to it) whenever the page was scrolled even slightly.

              Fix: the outer wrapper below keeps a CONSTANT layout box
              (always 250px wide - the logo's largest size), so the header
              never needs to reflow. The shrink effect on scroll is done
              purely with a CSS `transform: scale()` on that wrapper, which
              is a compositor-only animation (GPU accelerated, no layout
              recalculation), anchored at the left edge so it shrinks in
              place instead of drifting. The inner <img> keeps its own
              independent hover-scale effect from .nb-logo-img.
            */}
            <Link
              href="/"
              style={{
                lineHeight: 0,
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "250px",
                  lineHeight: 0,
                  transform: scrolled ? "scale(0.56)" : "scale(1)",
                  transformOrigin: "left center",
                  transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                <img
                  src={logo}
                  alt="Natures Natural India"
                  className="nb-logo-img"
                  style={{
                    width: "250px",
                    height: "auto",
                    objectFit: "contain",
                    filter: "contrast(1.15) brightness(1.04) saturate(1.1)",
                    transition: "filter 0.3s",
                  }}
                />
              </span>
            </Link>

            {/* ── DESKTOP NAV (centered) ── */}
            <nav
              className="hidden lg:flex items-center h-full"
              style={{ flex: 1, justifyContent: "center" }}
            >
              {navItems.map((item) => (
                <NavItem key={item.label} {...item} scrolled={scrolled} />
              ))}
            </nav>

            {/* ── RIGHT: CTA + hamburger ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexShrink: 0,
              }}
            >
              {/* CTA */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenInquiry?.();
                }}
                className="hidden sm:inline-flex nb-cta-btn"
              >
                Get Free Quote
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M2 6h8M6 2l4 4-4 4" />
                </svg>
              </a>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="flex flex-col lg:hidden"
                aria-label="Toggle menu"
                style={{
                  gap: 5,
                  padding: "8px 6px",
                  background: "none",
                  border: "1px solid rgba(196,168,130,0.3)",
                  borderRadius: 5,
                  cursor: "pointer",
                  transition: "background 0.18s",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      display: "block",
                      width: 20,
                      height: 2,
                      background: "var(--color-text-primary)",
                      borderRadius: 2,
                      transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
                      transform:
                        menuOpen && i === 0
                          ? "rotate(45deg) translateY(7px)"
                          : menuOpen && i === 2
                            ? "rotate(-45deg) translateY(-7px)"
                            : "none",
                      opacity: menuOpen && i === 1 ? 0 : 1,
                    }}
                  />
                ))}
              </button>
            </div>
          </header>

          {/* ── MOBILE DRAWER ── */}
          {menuOpen && (
            <div
              className="lg:hidden nb-mobile-drawer"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "100%",
                zIndex: 2000,
                background: "#fff",
                borderTop: "2px solid var(--color-brown-light)",
                boxShadow: "0 16px 48px rgba(62,43,30,0.16)",
                maxHeight: "calc(100vh - 80px)",
                overflowY: "auto",
              }}
            >
              {/* Mobile trust strip */}
              <div
                style={{
                  background: "#faf8f5",
                  padding: "8px 26px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--color-brown-muted, #8B6650)",
                  letterSpacing: "0.07em",
                  borderBottom: "1px solid rgba(196,168,130,0.2)",
                }}
              >
                🌿 Pure &amp; Natural &nbsp;·&nbsp; 🔬 Lab Tested &nbsp;·&nbsp;
                🚢 Global Export
              </div>

              {/* Mobile Accordion Sections */}
              <MobileSection title="Oils" items={oilsItems} />
              <MobileSection
                title="About Us"
                items={[
                  { label: "Our Offices", href: "/our-offices" },
                  { label: "Policies", href: "/policies" },
                  { label: "Certificate", href: "/our-certification" },
                  { label: "Contact Us", href: "/contact-us" },
                ]}
              />
              <MobileSection
                title="Distillation"
                items={[
                  { label: "Steam Distillation", href: "/steam-distillation" },
                  { label: "Cold Pressing", href: "/cold-pressing" },
                  { label: "Solvent Extraction", href: "/solvent-extraction" },
                ]}
              />
              <MobileSection
                title="Private Label"
                items={[
                  { label: "Bulk Orders", href: "/bulk-orders" },
                  { label: "Private Labelling", href: "/private-labelling" },
                  { label: "Custom Blends", href: "/custom-blends" },
                  { label: "Wholesale", href: "/wholesale" },
                  { label: "Secure Shopping", href: "/secure-shopping" },
                ]}
              />
              <MobileSection
                title="Packaging"
                items={[
                  { label: "Barrel Packaging", href: "/barrel-packaging" },
                  { label: "Private Packaging", href: "/private-packaging" },
                ]}
              />

              {[
                { label: "Shipping", href: "/delivery-info" },
                { label: "Quality Assurance", href: "/quality-assurance" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  style={{
                    display: "block",
                    padding: "13px 26px",
                    fontSize: 14.5,
                    fontWeight: 500,
                    color: "var(--color-text-muted)",
                    borderBottom: "1px solid rgba(196,168,130,0.18)",
                    textDecoration: "none",
                    transition: "color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-dark-brown)";
                    e.currentTarget.style.background = "#faf8f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-text-muted)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {label}
                </Link>
              ))}

              <div style={{ padding: "16px 26px" }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenInquiry?.();
                    setMenuOpen(false);
                  }}
                  className="nb-cta-btn"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  Get Free Quote →
                </a>
              </div>

              {/* Mobile contact */}
              <div
                style={{
                  padding: "12px 26px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <a
                  href="tel:+919711003901"
                  style={{
                    fontSize: 12.5,
                    color: "var(--color-brown-muted, #8B6650)",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  📞 +91 9711003901
                </a>
                <a
                  href="mailto:info@naturesnaturalindia.com"
                  style={{
                    fontSize: 12.5,
                    color: "var(--color-brown-muted, #8B6650)",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  ✉ info@naturesnaturalindia.com
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
