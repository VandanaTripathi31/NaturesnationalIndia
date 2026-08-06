"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { categoryHref, productHref } from "../../lib/seo-routes";
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
  const imageUrl = product.images?.[0]?.url?.trim() || null;

  return (
    <motion.article
      variants={fadeUp}
      custom={index}
      className="product-card group relative flex flex-col overflow-hidden rounded-2xl bg-[var(--color-cream-white)] border border-[var(--color-warm-gray)] shadow-sm"
      style={{ boxShadow: "0 2px 20px rgba(92,64,51,0.07)" }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Leaf size={32} className="text-[var(--color-brown-muted)]" />
          </div>
        )}

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
  const buildPageHref = (page) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query
      ? `${categoryHref(category.slug)}?${query}`
      : categoryHref(category.slug);
  };

  const heroImageUrl = category.image?.url?.trim() || null;

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-cream-white)" }}
    >
      {/* ── Hero ─────────────────────────────────────────────── */}
      {/* Fixed, contained height so a long category description can't
          stretch the banner to an unattractive size. */}
      <section className="relative flex items-end overflow-hidden min-h-[320px] h-[42vh] max-h-[460px]">
        {/* Background image */}
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={category.name}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
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

        {/* Breadcrumb */}
        <div className="absolute top-8 left-0 right-0 px-6 sm:px-10 lg:px-16 z-10">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                // {
                //   label: "Categories",
                //   href: categories[0] ? categoryHref(categories[0].slug) : "/",
                // },
                { label: category.name },
              ]}
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 pb-10 sm:px-10 sm:pb-12 lg:px-16 lg:pb-14">
          <div className="mx-auto max-w-7xl">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="font-playfair"
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
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Showing page{" "}
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {pagination.page}
                    </span>{" "}
                    of {pagination.totalPages} ·{" "}
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {pagination.total}
                    </span>{" "}
                    {pagination.total === 1 ? "product" : "products"}
                  </p>

                  {pagination.totalPages > 1 && (
                    <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
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
