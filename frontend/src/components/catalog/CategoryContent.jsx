"use client";

import { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { CATEGORY_CONTENT } from "../../lib/category-content";

/*
  Category SEO content shown below the product listing.

  Sources, in priority order:
    1. category.content  — DB-managed HTML (Admin Dashboard)
    2. CATEGORY_CONTENT[slug] — structured code fallback (headings/lists/FAQ)
    3. category.description — plain text

  Features (client review round 2):
    - "Read More" / "Read Less": only the first paragraph shows initially;
      the rest expands with a smooth animation.
    - FAQ items render as an accordion with an animated expand/collapse icon.
*/

const headingCls =
  "mt-8 font-playfair text-xl font-semibold text-[var(--color-text-primary)]";
const paraCls =
  "text-[15px] leading-relaxed text-[var(--color-text-muted)]";

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-warm-gray)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-semibold text-[var(--color-text-primary)]">
          {q}
        </span>
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-off-white)] transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          <ChevronDown size={15} className="text-[var(--color-brown-muted)]" />
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <p className={`${paraCls} pb-4`}>{a}</p>
        </div>
      </div>
    </div>
  );
}

function StructuredContent({ title, blocks, categoryName }) {
  const [expanded, setExpanded] = useState(false);

  // First non-heading paragraph is always visible; everything else collapses.
  const firstParaIdx = blocks.findIndex((b) => b.type === "paragraph");
  const intro = firstParaIdx >= 0 ? blocks[firstParaIdx] : null;
  const rest = blocks.filter((_, i) => i !== firstParaIdx);

  const renderBlock = (block, i) => {
    if (block.type === "heading")
      return (
        <h3 key={i} className={headingCls}>
          {block.text}
        </h3>
      );
    if (block.type === "list")
      return (
        <ul
          key={i}
          className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-[var(--color-text-muted)]"
        >
          {block.items.map((it, j) => (
            <li key={j}>{it}</li>
          ))}
        </ul>
      );
    if (block.type === "faq")
      return <FaqItem key={i} q={block.q} a={block.a} />;
    return (
      <p key={i} className={paraCls}>
        {block.text}
      </p>
    );
  };

  return (
    <section className="mt-14 border-t border-[var(--color-warm-gray)] pt-10">
      <h2 className="font-playfair text-2xl font-semibold text-[var(--color-text-primary)]">
        {title || categoryName}
      </h2>
      <div className="mt-5 space-y-4">
        {intro && renderBlock(intro, "intro")}

        {/* Collapsible remainder */}
        <div
          className="grid transition-all duration-500 ease-out"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="space-y-4">{rest.map(renderBlock)}</div>
          </div>
        </div>

        {rest.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-dark-brown)] underline-offset-4 hover:underline"
          >
            {expanded ? (
              <>
                <Minus size={15} /> Read Less
              </>
            ) : (
              <>
                <Plus size={15} /> Read More
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}

function HtmlContent({ html }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="mt-14 border-t border-[var(--color-warm-gray)] pt-10">
      <div
        className="grid transition-all duration-500 ease-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className="category-content max-w-none space-y-4 text-[15px] leading-relaxed text-[var(--color-text-muted)] [&_h2]:font-playfair [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[var(--color-text-primary)] [&_h3]:mt-8 [&_h3]:font-playfair [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--color-text-primary)] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[var(--color-dark-brown)] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
      {/* Clamp preview when collapsed */}
      {!expanded && (
        <div
          className="category-content max-w-none text-[15px] leading-relaxed text-[var(--color-text-muted)] [&_h2]:font-playfair [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[var(--color-text-primary)]"
          style={{
            maxHeight: 140,
            overflow: "hidden",
            maskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-dark-brown)] underline-offset-4 hover:underline"
      >
        {expanded ? (
          <>
            <Minus size={15} /> Read Less
          </>
        ) : (
          <>
            <Plus size={15} /> Read More
          </>
        )}
      </button>
    </section>
  );
}

export default function CategoryContent({ category }) {
  if (category.content && category.content.trim()) {
    return <HtmlContent html={category.content} />;
  }

  const rich = CATEGORY_CONTENT[category.slug];
  if (rich) {
    return (
      <StructuredContent
        title={rich.title}
        blocks={rich.blocks}
        categoryName={category.name}
      />
    );
  }

  if (!category.description) return null;
  const paras = category.description
    .split(/\n{2,}|\r\n\r\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <StructuredContent
      title={category.name}
      blocks={paras.map((text) => ({ type: "paragraph", text }))}
      categoryName={category.name}
    />
  );
}
