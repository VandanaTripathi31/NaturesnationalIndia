"use client";

import { useState } from "react";
import { COMPANY_INFO_TABS } from "../../lib/company-info";
import { buildOverviewSections } from "../../lib/product-overview";

/*
  Product information tabs — mirrors the live site's product page tab strip:
    Overview | Order Processing | Packaging | Private Labelling |
    Shipping Preferences | Payment Method

  "Overview" is product-specific and reproduces the structure of the
  original product pages (client-supplied reference): Botanical Name,
  Country of origin, Odor, Colour, Extraction Method, Components,
  Solubility, Blends well with, History, Uses, Therapeutic Benefits, FAQs
  — see lib/product-overview.js for the field mapping.

  The remaining five tabs are company-wide and come from a single shared
  source (lib/company-info.js).

  Block types supported here:
    - "image"      full-width centered image (matches the original site's
                    ".over-img" treatment — Order Processing / Shipping /
                    Payment / Packaging hero shots)
    - "imageText"  image next to text, like the original's Private
                    Labelling rows (per bottle-size images with copy next
                    to each). Pass `reverse: true` to put the image on the
                    right instead of the left.
    - "grid"       a simple 2-up grid of { image, heading, text } items,
                    used for the gift-set / box-packaging pair at the
                    bottom of Private Labelling.
    - "heading" / "subheading" / "paragraph" / "list" / "rows" / "faqs"
                    same as before.
*/

// ---------------------------------------------------------------------
// Image with a VISIBLE fallback instead of silently disappearing.
// If this renders instead of your real photo, the src below is wrong —
// check spelling AND case (Linux hosting is case-sensitive even if your
// local machine isn't).
// ---------------------------------------------------------------------
function Img({ src, alt = "", className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-dashed border-[var(--color-warm-gray)] bg-[var(--color-warm-gray)]/20 p-6 text-center text-xs text-[var(--color-text-muted)] ${className}`}
        role="img"
        aria-label={alt || "Image failed to load"}
      >
        <span>
          Image not found:
          <br />
          <code className="break-all">{src}</code>
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[var(--color-warm-gray)] py-3 last:border-b-0 sm:flex-row sm:gap-4">
      <span className="w-full shrink-0 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] sm:w-48">
        {label}
      </span>
      <span className="text-sm leading-relaxed text-[var(--color-text-primary)]">
        {value}
      </span>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(!q);
  return (
    <div className="border-b border-[var(--color-warm-gray)] last:border-b-0">
      {q ? (
        <>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-4 py-3 text-left"
          >
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {q}
            </span>
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center text-[var(--color-brown-muted)] transition-transform duration-300"
              style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
              aria-hidden="true"
            >
              +
            </span>
          </button>
          {open && (
            <p className="pb-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {a}
            </p>
          )}
        </>
      ) : (
        <p className="py-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
          {a}
        </p>
      )}
    </div>
  );
}

function Block({ block }) {
  if (block.type === "image") {
    return (
      <div className="my-4 flex justify-center">
        <Img
          src={block.src}
          alt={block.alt ?? ""}
          className="h-auto max-w-full rounded-xl border border-[var(--color-warm-gray)] object-contain"
        />
      </div>
    );
  }

  if (block.type === "imageText") {
    const imageCol = (
      <div className="w-full sm:w-2/5">
        <Img
          src={block.image?.src}
          alt={block.image?.alt ?? ""}
          className="h-auto w-full rounded-xl border border-[var(--color-warm-gray)] object-contain"
        />
      </div>
    );
    const textCol = (
      <div className="w-full sm:w-3/5">
        {block.heading && (
          <h5 className="mb-1.5 font-playfair text-sm font-semibold text-[var(--color-text-primary)]">
            {block.heading}
          </h5>
        )}
        {(block.text ?? []).map((line, i) => (
          <p
            key={i}
            className="mb-1.5 text-sm leading-relaxed text-[var(--color-text-muted)] last:mb-0"
          >
            {line}
          </p>
        ))}
      </div>
    );
    return (
      <div className="my-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {block.reverse ? (
          <>
            {textCol}
            {imageCol}
          </>
        ) : (
          <>
            {imageCol}
            {textCol}
          </>
        )}
      </div>
    );
  }

  if (block.type === "grid") {
    return (
      <div className="my-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {block.items.map((item, i) => (
          <div key={i}>
            <Img
              src={item.image?.src}
              alt={item.image?.alt ?? ""}
              className="mb-2 h-auto w-full rounded-xl border border-[var(--color-warm-gray)] object-contain"
            />
            {item.heading && (
              <h6 className="mb-1 font-playfair text-sm font-semibold text-[var(--color-text-primary)]">
                {item.heading}
              </h6>
            )}
            {(item.text ?? []).map((line, li) => (
              <p
                key={li}
                className="mb-1 text-sm leading-relaxed text-[var(--color-text-muted)] last:mb-0"
              >
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (block.type === "heading") {
    return (
      <h3 className="mt-5 mb-2 font-playfair text-base font-semibold text-[var(--color-text-primary)]">
        {block.text}
      </h3>
    );
  }

  if (block.type === "subheading") {
    return (
      <h4 className="mt-4 mb-2 font-playfair text-sm font-semibold text-[var(--color-text-primary)]">
        {block.text}
      </h4>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="mb-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--color-text-muted)]">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "rows") {
    return (
      <div className="mb-3">
        {block.rows.map((row, i) => (
          <Row key={`${row.label}-${i}`} label={row.label} value={row.value} />
        ))}
      </div>
    );
  }

  if (block.type === "faqs") {
    return (
      <div className="mb-3">
        {block.items.map((item, i) => (
          <FaqItem key={i} q={item.q} a={item.a} />
        ))}
      </div>
    );
  }

  return (
    <p className="mb-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
      {block.text}
    </p>
  );
}

export default function ProductInfoTabs({ product }) {
  const overviewSections = buildOverviewSections(product);

  const overviewBlocks =
    overviewSections.length > 0
      ? overviewSections
      : [
          {
            type: "paragraph",
            text:
              product?.overview?.trim() ||
              product?.history?.trim() ||
              `${product?.name ?? "This product"} is offered by Natures Natural India as a manufacturer, supplier and wholesaler of pure and natural oils.`,
          },
        ];

  const overview = {
    id: "overview",
    label: "Overview",
    blocks: overviewBlocks,
  };

  const tabs = [overview, ...COMPANY_INFO_TABS];
  const [active, setActive] = useState(tabs[0].id);
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <section className="mt-12">
      {/* Tab strip */}
      <div
        className="flex flex-wrap gap-1 border-b border-[var(--color-warm-gray)]"
        role="tablist"
        aria-label="Product information"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              className={[
                "relative -mb-px whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border border-b-0 border-[var(--color-warm-gray)] bg-white text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div
        role="tabpanel"
        className="rounded-b-2xl rounded-tr-2xl border border-t-0 border-[var(--color-warm-gray)] bg-white px-5 py-5 sm:px-7 sm:py-6"
      >
        {activeTab.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </section>
  );
}
