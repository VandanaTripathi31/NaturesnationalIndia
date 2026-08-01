"use client";

import { useState } from "react";
import { ChevronDown, ArrowUpRight, Leaf } from "lucide-react";
import Link from "next/link";
import { categoryHref } from "../lib/seo-routes";

// Fallback image used only when a category has no image set in the
// admin-managed data yet — keeps the grid from breaking, never hardcodes
// product/category content.
const FALLBACK_IMG = "/images/essential-oil.jpg";

// How many categories show before "View More Categories" is used. Purely a
// display/pagination concern — the underlying list is always the live
// category set from the API (same data source as the Navbar).
const INITIAL_VISIBLE_COUNT = 8;

// ── Circle size tokens — change here to resize everywhere ──
const CIRCLE = 180; // main image diameter (px)
const RING_GAP = 3; // gap between image edge and solid ring
const DASHED_GAP = 8; // gap between image edge and dashed ring
const BADGE = 34; // arrow badge diameter (px)

function CategoryCard({ name, img, slug, index }) {
  const [hovered, setHovered] = useState(false);

  // Same route the Navbar uses for this exact category — guarantees both
  // entry points open the identical dynamic category page, never a
  // duplicate.
  const categoryLink = categoryHref(slug);

  return (
    <Link
      href={categoryLink}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="category-card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        textDecoration: "none",
        padding: "32px 18px 28px",
        borderRadius: 4,
        background: hovered ? "rgba(196,168,130,0.13)" : "transparent",
        border: `1px solid ${hovered ? "rgba(196,168,130,0.45)" : "transparent"}`,
        transition:
          "background 0.3s, border-color 0.3s, transform 0.35s cubic-bezier(0.22,1,0.36,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        cursor: "pointer",
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Circular image with decorative rings */}
      <div
        className="circle-wrap"
        style={{
          position: "relative",
          width: CIRCLE,
          height: CIRCLE,
          flexShrink: 0,
        }}
      >
        {/* Outer decorative spinning dashed ring on hover */}
        <div
          style={{
            position: "absolute",
            inset: -DASHED_GAP,
            borderRadius: "50%",
            border: `1.5px dashed ${hovered ? "var(--color-brown-light)" : "rgba(196,168,130,0.25)"}`,
            transition: "border-color 0.3s",
            animation: hovered ? "spinSlow 8s linear infinite" : "none",
          }}
        />

        {/* Solid inner ring */}
        <div
          style={{
            position: "absolute",
            inset: -RING_GAP,
            borderRadius: "50%",
            border: `2.5px solid ${hovered ? "var(--color-brown-mid)" : "rgba(196,168,130,0.35)"}`,
            transition: "border-color 0.3s",
            boxShadow: hovered
              ? "0 0 0 4px rgba(196,168,130,0.12), 0 8px 28px rgba(90,55,35,0.18)"
              : "0 4px 16px rgba(90,55,35,0.08)",
          }}
        />

        {/* Circular image */}
        <div
          style={{
            width: CIRCLE,
            height: CIRCLE,
            borderRadius: "50%",
            overflow: "hidden",
            position: "relative",
            background: "var(--color-off-white, #faf8f5)",
          }}
        >
          <img
            src={img || FALLBACK_IMG}
            alt={name}
            // If a migrated category URL is broken/404, fall back to the
            // local placeholder instead of showing an empty circle.
            onError={(e) => {
              if (e.currentTarget.src !== window.location.origin + FALLBACK_IMG) {
                e.currentTarget.src = FALLBACK_IMG;
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              // "cover" fills the whole circle (no empty white bands) while
              // preserving aspect ratio, so images are never stretched — the
              // edges are cropped instead.
              objectFit: "cover",
              objectPosition: "center",
              transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
          />
          {/* Warm overlay on hover */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: hovered ? "rgba(90,55,35,0.18)" : "transparent",
              transition: "background 0.3s",
            }}
          />
        </div>

        {/* Arrow icon badge — appears on hover */}
        <div
          style={{
            position: "absolute",
            bottom: 6,
            right: 6,
            width: BADGE,
            height: BADGE,
            borderRadius: "50%",
            background: "var(--color-brown-mid)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1)" : "scale(0.6)",
            transition: "opacity 0.25s, transform 0.25s",
            boxShadow: "0 3px 10px rgba(62,43,30,0.35)",
          }}
        >
          <ArrowUpRight
            size={16}
            color="var(--color-cream-white)"
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Name */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily:
              "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: "clamp(15px, 1.5vw, 18px)",
            fontWeight: 600,
            color: hovered
              ? "var(--color-dark-brown)"
              : "var(--color-text-primary)",
            margin: "0 0 6px",
            lineHeight: 1.3,
            letterSpacing: "0.01em",
            transition: "color 0.25s",
          }}
        >
          {name}
        </p>

        {/* Animated underline */}
        <div
          style={{
            height: 1.5,
            width: hovered ? 44 : 20,
            background:
              "linear-gradient(90deg, var(--color-brown-light), var(--color-brown-muted))",
            margin: "0 auto",
            borderRadius: 2,
            transition: "width 0.35s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
    </Link>
  );
}

export default function ProductCategories({ categories = [] }) {
  const [showMore, setShowMore] = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  // Map the existing category API response (name, slug, image.url) straight
  // into the card shape this section already renders — no product/category
  // data is invented here, only read from what the API returned.
  const cards = categories.map((category) => ({
    name: category.name,
    slug: category.slug,
    img: category.image?.url || "",
  }));

  const visibleCategories = showMore
    ? cards
    : cards.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = cards.length > INITIAL_VISIBLE_COUNT;

  return (
    <section
      id="cat-sec"
      style={{
        background:
          "linear-gradient(160deg, #f5ede4 0%, #f0e8de 50%, #ede3d8 100%)",
        padding: "80px 24px 72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background texture circles */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "rgba(196,168,130,0.10)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "rgba(196,168,130,0.08)",
          pointerEvents: "none",
        }}
      />

      {/* ── Header ── */}
      <div
        style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 60px" }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 28,
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
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "var(--color-brown-muted)",
              margin: 0,
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            Our Premium Range
          </p>
          <span
            style={{
              display: "inline-block",
              width: 28,
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
            fontSize: "clamp(28px, 4.5vw, 42px)",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            lineHeight: 1.2,
            margin: "0 0 16px",
            letterSpacing: "0.01em",
          }}
        >
          Explore Our Product Categories
        </h2>

        <p
          style={{
            fontSize: 15,
            color: "var(--color-text-muted)",
            lineHeight: 1.8,
            margin: "0 auto",
            maxWidth: 500,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 400,
          }}
        >
          Crafted with purity and excellence — trusted by 15,000+ global brands,
          manufacturers, and wellness businesses across 70+ countries.
        </p>

        <div
          style={{
            width: 48,
            height: 2,
            background:
              "linear-gradient(90deg, var(--color-brown-light), var(--color-brown-muted))",
            margin: "22px auto 0",
            borderRadius: 2,
          }}
        />
      </div>

      {/* ── Grid ── */}
      <div
        className="cat-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px 8px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {visibleCategories.map((cat, i) => (
          <CategoryCard key={cat.slug || cat.name} {...cat} index={i} />
        ))}
      </div>

      {cards.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 16px",
            color: "var(--color-text-muted)",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 14,
          }}
        >
          <Leaf
            size={28}
            style={{ margin: "0 auto 12px", color: "var(--color-brown-muted)" }}
          />
          Categories are being updated. Please check back shortly.
        </div>
      )}

      {/* ── Show more button ── */}
      {hasMore && (
      <div style={{ textAlign: "center", marginTop: 44 }}>
        <button
          onClick={() => setShowMore((p) => !p)}
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            border: `1.5px solid ${btnHov ? "var(--color-dark-brown)" : "var(--color-brown-light)"}`,
            background: btnHov ? "var(--color-dark-brown)" : "transparent",
            color: btnHov
              ? "var(--color-cream-white)"
              : "var(--color-dark-brown)",
            padding: "12px 32px",
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.25s",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            boxShadow: btnHov ? "0 4px 16px rgba(62,43,30,0.18)" : "none",
          }}
        >
          {showMore ? "Show Less" : "View More Categories"}
          <ChevronDown
            size={15}
            style={{
              transition: "transform 0.3s",
              transform: showMore ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
      </div>
      )}

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ── Responsive grid ── */
        @media (max-width: 1024px) {
          .cat-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 700px) {
          .cat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 6px 4px !important; }
        }

        /* ── Responsive circle size ── */
        @media (max-width: 700px) {
          .circle-wrap {
            width: 120px !important;
            height: 120px !important;
          }
          .circle-wrap > div:nth-child(3) {
            width: 120px !important;
            height: 120px !important;
          }
        }
        @media (max-width: 400px) {
          .circle-wrap {
            width: 100px !important;
            height: 100px !important;
          }
          .circle-wrap > div:nth-child(3) {
            width: 100px !important;
            height: 100px !important;
          }
        }

        /* ── Reduce card padding on mobile ── */
        @media (max-width: 700px) {
          .category-card {
            padding: 20px 8px 18px !important;
            gap: 12px !important;
          }
        }

        /* ── Section padding on mobile ── */
        @media (max-width: 700px) {
          #cat-sec {
            padding: 52px 12px 56px !important;
          }
        }
      `}</style>
    </section>
  );
}
