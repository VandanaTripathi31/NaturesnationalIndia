"use client";

import { useState } from "react";
import { COMPANY_INFO_TABS } from "../../lib/company-info";

/*
  Product information tabs — mirrors the live site's product page tab strip:
    Overview | Order Processing | Packaging | Private Labelling |
    Shipping Preferences | Payment Method

  "Overview" is product-specific (product.description). The remaining five are
  company-wide and come from a single shared source (lib/company-info.js), so
  the client edits them in ONE place for all products rather than per product.
*/

function Block({ block }) {
  if (block.type === "heading") {
    return (
      <h3 className="mt-5 mb-2 font-playfair text-base font-semibold text-[var(--color-text-primary)]">
        {block.text}
      </h3>
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
  return (
    <p className="mb-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
      {block.text}
    </p>
  );
}

export default function ProductInfoTabs({ product }) {
  const overview = {
    id: "overview",
    label: "Overview",
    blocks: [
      {
        type: "paragraph",
        text:
          product?.description ||
          `${product?.name ?? "This product"} is offered by Natures Natural India as a manufacturer, supplier and wholesaler of pure and natural oils.`,
      },
    ],
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
