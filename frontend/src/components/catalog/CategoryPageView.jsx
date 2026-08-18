"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { categoryHref, productHref } from "../../lib/seo-routes";
import { resolveImageUrl, isLegacyMediaUrl } from "../../lib/image-url";
import SafeImage from "../ui/SafeImage";
import CategoryContent from "./CategoryContent";
import {
  ArrowRight,
  Leaf,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  Package,
  MapPin,
  Phone,
  Mail,
  FlaskConical,
  PhoneCall,
} from "lucide-react";

// Both CTAs use the site's existing global inquiry modal (see
// FloatingInquiry.jsx) — no new backend endpoint, just the current
// admin-managed inquiry flow triggered from a product card.
function openInquiry() {
  window.dispatchEvent(new CustomEvent("open-inquiry"));
}
import CategorySidebar from "../../../src/components/CategorySidebar";
import Breadcrumb from "../../../src/components/Breadcrumb";

/*  Animation Variants  */
// Page-size options for the "Show" dropdown. 15 matches the reference
// screenshot's default; the rest are sensible multiples capped by the
// backend's own limit ceiling (getPublicCategoryBySlug clamps to 50).
const DEFAULT_PAGE_SIZE = 15;
const PAGE_SIZE_OPTIONS = [15, 30, 45, 50];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Product Card ─────────────────────────────────────────── */
function ProductCard({ product, index, categorySlug }) {
  const imageUrl = resolveImageUrl(product.images?.[0]?.url, `card:${product.name}`);

  return (
    <motion.article
      variants={fadeUp}
      custom={index}
      className="product-card group relative flex flex-col overflow-hidden rounded-2xl bg-[var(--color-cream-white)] border border-[var(--color-warm-gray)] shadow-sm"
      style={{ boxShadow: "0 2px 20px rgba(92,64,51,0.07)" }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <SafeImage
          src={imageUrl}
          alt={product.name}
          fill
          className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          fallbackIconSize={32}
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="flex items-center gap-1 rounded-full bg-[var(--color-dark-brown)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-cream-white)]">
              <Star size={9} fill="currentColor" /> Featured
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <Link
          href={productHref(
            product.category?.slug || categorySlug,
            product.slug,
          )}
          className="font-playfair text-lg font-semibold leading-snug text-[var(--color-text-primary)] transition hover:text-[var(--color-dark-brown)]"
        >
          {product.name}
        </Link>
        {product.botanicalName && (
          <p className="mt-1 text-[11px] italic text-[var(--color-brown-muted)]">
            {product.botanicalName}
          </p>
        )}

        {(product.origin || product.extractionMethod) && (
          <div className="mt-2.5 flex flex-col gap-1">
            {product.origin && (
              <p className="flex items-start gap-1.5 text-[11.5px] text-[var(--color-text-muted)]">
                <MapPin
                  size={12}
                  className="mt-0.5 shrink-0 text-[var(--color-brown-muted)]"
                />
                <span>
                  <span className="font-semibold">Origin:</span>{" "}
                  {product.origin}
                </span>
              </p>
            )}
            {product.extractionMethod && (
              <p className="flex items-start gap-1.5 text-[11.5px] text-[var(--color-text-muted)]">
                <FlaskConical
                  size={12}
                  className="mt-0.5 shrink-0 text-[var(--color-brown-muted)]"
                />
                <span>
                  <span className="font-semibold">Extraction:</span>{" "}
                  {product.extractionMethod}
                </span>
              </p>
            )}
          </div>
        )}

        {/* CTAs — solid Get a Quote + Request Call Back (matches live site) */}
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <button
            type="button"
            onClick={openInquiry}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-[11.5px] font-semibold text-[var(--color-cream-white)] transition hover:opacity-90"
            style={{ background: "var(--color-dark-brown)" }}
          >
            <Mail size={13} /> Get a Quote
          </button>
          <button
            type="button"
            onClick={openInquiry}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-[11.5px] font-semibold text-[var(--color-cream-white)] transition hover:opacity-90"
            style={{ background: "var(--color-brown-muted)" }}
          >
            <PhoneCall size={13} /> Request Call Back
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function CategoryPageView({
  category,
  products,
  pagination,
  categories,
  featuredProducts,
  searchQuery,
}) {
  const router = useRouter();

  const buildPageHref = (page, limit = pagination?.limit) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (page > 1) params.set("page", String(page));
    // Only carry a non-default page size in the URL so the plain category
    // URL stays canonical/clean at the default size.
    if (limit && limit !== DEFAULT_PAGE_SIZE)
      params.set("limit", String(limit));
    const query = params.toString();
    return query
      ? `${categoryHref(category.slug)}?${query}`
      : categoryHref(category.slug);
  };

  // Changing page size resets to page 1 (the current page's items no
  // longer line up under a different page size) and preserves the active
  // search, matching the existing pagination link behavior.
  const handlePageSizeChange = (event) => {
    router.push(buildPageHref(1, Number(event.target.value)));
  };

  const heroImageUrl = resolveImageUrl(category.image?.url);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "var(--color-cream-white)" }}
    >
      {/* ── Hero ─────────────────────────────────────────────── */}
      {/*
        FIX (round 3 — hero half-width bug): the section previously had no
        explicit width class. A <section> is a block element, so it should
        stretch to 100% of its parent automatically — but the <Image fill>
        inside it is position:absolute and contributes ZERO intrinsic width
        to the section. If this component is ever rendered inside a flex
        (or similar) parent upstream without `flex-1`/`w-full` on it, a
        block child with no intrinsic content width shrinks to fit-content
        instead of stretching to fill the row — which is exactly the
        "image only fills the left half, blank space on the right" bug
        reported from the screenshot (the stats row below rendered full
        width fine because it sits in its own explicitly-padded div, not
        relying on the section's own box for width).

        Fix: force `w-full` on the section itself so its width can never
        depend on flex/grid sizing behavior in a parent we don't control
        here, and make the Image explicitly h-full/w-full as a second
        safety net alongside `fill`.
      */}
      <section className="relative w-full overflow-hidden aspect-[3/2] sm:aspect-[1200/624] sm:max-h-[440px]">
        {/* Background image */}
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={category.name}
            fill
            priority
            className="absolute inset-0 h-full w-full object-cover object-center"
            sizes="100vw"
            // See SafeImage.jsx FIX comment: the legacy host's hotlink
            // protection 403s any request carrying a cross-origin
            // Referer, which every embedded <img> sends by default.
            unoptimized={isLegacyMediaUrl(heroImageUrl)}
            referrerPolicy={isLegacyMediaUrl(heroImageUrl) ? "no-referrer" : undefined}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero)" }}
          />
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(30,15,5,0.90) 0%, rgba(30,15,5,0.55) 50%, rgba(30,15,5,0.15) 100%)",
          }}
        />

        {/* Content column: breadcrumb, title, description, buttons —
            vertically centered in the hero's full height. */}
        <div className="relative z-10 flex h-full flex-col justify-center px-6 py-8 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <Breadcrumb
              items={[
                // {
                //   label: "Categories",
                //   href: categories[0] ? categoryHref(categories[0].slug) : "/",
                // },
                { label: category.name },
              ]}
            />
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="font-playfair mt-3"
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.8rem)",
                  fontWeight: 600,
                  lineHeight: 1.18,
                  color: "var(--color-cream-white)",
                  margin: 0,
                }}
              >
                {category.name}
              </motion.h1>
              {category.description && (
                <motion.p
                  variants={fadeUp}
                  custom={2}
                  className="mt-4 max-w-2xl leading-relaxed line-clamp-2 text-sm sm:text-[15px]"
                  style={{ color: "rgba(248,245,242,0.80)" }}
                >
                  {category.description}
                </motion.p>
              )}
              <motion.div
                variants={fadeUp}
                custom={3}
                style={{
                  marginTop: "1.1rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.65rem",
                  alignItems: "center",
                }}
              >
                <a
                  href="#products"
                  className="btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.78rem",
                    padding: "0.5rem 1.1rem",
                  }}
                >
                  Explore Products <ArrowRight size={13} />
                </a>
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("open-brochure"))
                  }
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.78rem",
                    padding: "0.5rem 1.1rem",
                    borderRadius: "9999px",
                    border: "1.5px solid rgba(248,245,242,0.35)",
                    color: "var(--color-cream-white)",
                    fontWeight: 600,
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  Request Catalogue
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Floating Stats ────────────────────────────────────── */}
      <div className="relative z-20 px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-3 lg:grid-cols-4 -mt-8"
          >
            {[
              {
                icon: Package,
                label: "Products",
                value: pagination?.total ?? products.length,
              },
              { icon: Leaf, label: "Botanical", value: "100% Pure" },
              { icon: MapPin, label: "Sourced from", value: "Worldwide" },
              { icon: Star, label: "Quality", value: "Premium" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-[var(--color-warm-gray)] bg-white px-5 py-4 shadow-sm"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "var(--color-sage-light)" }}
                >
                  <Icon size={16} style={{ color: "var(--color-sage-dark)" }} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Content Grid ─────────────────────────────────────── */}
      <div id="products" className="px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
            {/* Sidebar */}
            <CategorySidebar
              categories={categories}
              activeSlug={category.slug}
              featuredProducts={featuredProducts}
              showSearch
            />

            {/* Products */}
            <section>
              {/* Section label */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-brown-muted)]">
                    Showing
                  </p>
                  <h2 className="font-playfair text-2xl font-semibold text-[var(--color-text-primary)]">
                    {products.length > 0
                      ? `${products.length} Products`
                      : "No Products Found"}
                  </h2>
                </div>
                {searchQuery && (
                  <span className="rounded-full border border-[var(--color-warm-gray)] px-4 py-1.5 text-xs text-[var(--color-text-muted)]">
                    Search: &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
              </div>

              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--color-warm-gray)] bg-white/60 py-20 text-center">
                  <Leaf
                    size={36}
                    className="mb-4"
                    style={{ color: "var(--color-brown-muted)" }}
                  />
                  <p className="text-sm text-[var(--color-text-muted)]">
                    No products found in this category.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={stagger}
                  className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {products.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={i}
                      categorySlug={category.slug}
                    />
                  ))}
                </motion.div>
              )}

              {/* Pagination — Prev / numbered pages / Next + totals */}
              {pagination && pagination.total > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm text-[var(--color-text-muted)]">
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {(pagination.page - 1) * pagination.limit + 1}
                      </span>
                      –
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total,
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {pagination.total}
                      </span>{" "}
                      {pagination.total === 1 ? "product" : "products"}
                    </p>

                    <label className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                      Show:
                      <select
                        value={pagination.limit}
                        onChange={handlePageSizeChange}
                        aria-label="Products per page"
                        className="rounded-lg border border-[var(--color-warm-gray)] bg-white px-2 py-1 text-sm font-medium text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-dark-brown)]"
                      >
                        {PAGE_SIZE_OPTIONS.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {pagination.totalPages > 1 && (
                    <nav
                      className="flex flex-wrap items-center justify-center gap-1.5"
                      aria-label="Pagination"
                    >
                      {/* Previous */}
                      {pagination.page > 1 ? (
                        <Link
                          href={buildPageHref(pagination.page - 1)}
                          aria-label="Previous page"
                          className="flex h-9 items-center gap-1 rounded-full border border-[var(--color-warm-gray)] bg-white px-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:border-[var(--color-dark-brown)] hover:text-[var(--color-dark-brown)]"
                        >
                          <ChevronLeft size={15} />
                        </Link>
                      ) : (
                        <span className="flex h-9 items-center rounded-full border border-[var(--color-warm-gray)] px-3 text-sm opacity-35">
                          <ChevronLeft size={15} />
                        </span>
                      )}

                      {/* Numbered pages with ellipsis window */}
                      {(() => {
                        const total = pagination.totalPages;
                        const cur = pagination.page;
                        const pages = [];
                        for (let n = 1; n <= total; n++) {
                          if (
                            n === 1 ||
                            n === total ||
                            (n >= cur - 1 && n <= cur + 1)
                          ) {
                            pages.push(n);
                          } else if (pages[pages.length - 1] !== "…") {
                            pages.push("…");
                          }
                        }
                        return pages.map((n, i) =>
                          n === "…" ? (
                            <span
                              key={`e${i}`}
                              className="flex h-9 w-9 items-center justify-center text-sm text-[var(--color-text-muted)]"
                            >
                              …
                            </span>
                          ) : n === cur ? (
                            <span
                              key={n}
                              aria-current="page"
                              className="flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-semibold text-[var(--color-cream-white)]"
                              style={{ background: "var(--gradient-btn)" }}
                            >
                              {n}
                            </span>
                          ) : (
                            <Link
                              key={n}
                              href={buildPageHref(n)}
                              className="flex h-9 min-w-9 items-center justify-center rounded-full border border-[var(--color-warm-gray)] bg-white px-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:border-[var(--color-dark-brown)] hover:text-[var(--color-dark-brown)]"
                            >
                              {n}
                            </Link>
                          ),
                        );
                      })()}

                      {/* Next */}
                      {pagination.page < pagination.totalPages ? (
                        <Link
                          href={buildPageHref(pagination.page + 1)}
                          aria-label="Next page"
                          className="flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-[var(--color-cream-white)]"
                          style={{ background: "var(--gradient-btn)" }}
                        >
                          <ChevronRight size={15} />
                        </Link>
                      ) : (
                        <span className="flex h-9 items-center rounded-full border border-[var(--color-warm-gray)] px-3 text-sm opacity-35">
                          <ChevronRight size={15} />
                        </span>
                      )}
                    </nav>
                  )}
                </motion.div>
              )}

              {/* ── SEO content (first page only): DB HTML → structured
                  code content → description, with Read More / FAQ accordion. */}
              {(!pagination || pagination.page === 1) && (
                <CategoryContent category={category} />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
