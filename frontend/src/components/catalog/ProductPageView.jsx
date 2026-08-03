"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { categoryHref } from "../../lib/seo-routes";
import ProductInfoTabs from "./ProductInfoTabs";
import {
  MapPin,
  Droplets,
  Leaf,
  Star,
  ArrowRight,
  Download,
  Phone,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FlaskConical,
  CheckCircle2,
  Zap,
  ClipboardList,
} from "lucide-react";

// Both CTAs on this page use the site's existing global inquiry / brochure
// modals (see FloatingInquiry.jsx and BrochureModal.jsx) rather than the
// previously dead /contact and /catalogue routes.
function openInquiry() {
  window.dispatchEvent(new CustomEvent("open-inquiry"));
}
function openBrochure() {
  window.dispatchEvent(new CustomEvent("open-brochure"));
}
import Breadcrumb from "../../../src/components/Breadcrumb";
import CategorySidebar from "../../../src/components/CategorySidebar";
import RelatedProducts from "../../../src/components/RelatedProducts";

/*  Variants  */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

/* ─── Info Row ─────────────────────────────────────────────── */
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-[var(--color-warm-gray)] bg-[var(--color-off-white)] px-5 py-4">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: "var(--color-sage-light)" }}
      >
        <Icon size={15} style={{ color: "var(--color-sage-dark)" }} />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-[var(--color-text-primary)]">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ─── Benefit Card ─────────────────────────────────────────── */
function BenefitCard({ text, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="flex items-start gap-3 rounded-2xl border border-[var(--color-warm-gray)] bg-white p-4 shadow-sm"
    >
      <CheckCircle2
        size={16}
        className="mt-0.5 shrink-0"
        style={{ color: "var(--color-sage-dark)" }}
      />
      <p className="text-sm leading-6 text-[var(--color-text-muted)]">{text}</p>
    </motion.div>
  );
}

/* ─── Use Card ─────────────────────────────────────────────── */
function UseCard({ text, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="flex items-start gap-3 rounded-2xl border border-[var(--color-warm-gray)] bg-[var(--color-off-white)] p-4"
    >
      <Zap
        size={15}
        className="mt-0.5 shrink-0"
        style={{ color: "var(--color-brown-muted)" }}
      />
      <p className="text-sm leading-6 text-[var(--color-text-muted)]">{text}</p>
    </motion.div>
  );
}

/* ─── Main ─────────────────────────────────────────────────── */
export default function ProductPageView({
  product,
  relatedProducts,
  categories,
  featuredProducts = [],
}) {
  const [activeImage, setActiveImage] = useState(0);
  const images = product.images ?? [];

  const prev = () =>
    setActiveImage((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveImage((i) => (i + 1) % images.length);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-cream-white)" }}
    >
      <div className="px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb
            items={[
              product.category
                ? {
                    label: product.category.name,
                    href: categoryHref(product.category.slug),
                  }
                : null,
              { label: product.name },
            ].filter(Boolean)}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[300px_1fr]">
            {/* Sidebar */}
            <CategorySidebar
              categories={categories}
              activeSlug={product.category?.slug}
              featuredProducts={featuredProducts}
            />

            {/* Main content */}
            <section>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="grid gap-8 rounded-3xl border border-[var(--color-warm-gray)] bg-white p-6 shadow-sm lg:grid-cols-2"
              >
                {/* ── Left: Gallery ─────────────────────────── */}
                <motion.div variants={fadeUp}>
                  {/* Main Image */}
                  <div
                    className="group relative aspect-square overflow-hidden rounded-2xl bg-white"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeImage}
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                      >
                        {images[activeImage]?.url ? (
                          <Image
                            src={images[activeImage].url}
                            alt={product.name}
                            fill
                            priority
                            className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Leaf
                              size={48}
                              style={{ color: "var(--color-brown-muted)" }}
                            />
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Nav arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prev}
                          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white"
                        >
                          <ChevronLeft
                            size={17}
                            style={{ color: "var(--color-dark-brown)" }}
                          />
                        </button>
                        <button
                          onClick={next}
                          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white"
                        >
                          <ChevronRight
                            size={17}
                            style={{ color: "var(--color-dark-brown)" }}
                          />
                        </button>
                      </>
                    )}

                    {/* Index dot */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              i === activeImage
                                ? "w-6 bg-white"
                                : "w-1.5 bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Vertical thumbnails */}
                  {images.length > 1 && (
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {images.map((image, index) => (
                        <button
                          key={image.public_id || `${image.url}-${index}`}
                          type="button"
                          onClick={() => setActiveImage(index)}
                          className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition ${
                            activeImage === index
                              ? "border-[var(--color-dark-brown)]"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={image.url}
                            alt={`${product.name} ${index + 1}`}
                            fill
                            className="object-contain p-1"
                            sizes="80px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* ── Right: Info ───────────────────────────── */}
                <div className="flex flex-col">
                  {/* Badges */}
                  <motion.div
                    variants={fadeUp}
                    className="flex flex-wrap items-center gap-2"
                  >
                    {product.featured && (
                      <span className="flex items-center gap-1 rounded-full bg-[var(--color-dark-brown)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-cream-white)]">
                        <Star size={10} fill="currentColor" /> Featured
                      </span>
                    )}
                    {product.category?.name && (
                      <span
                        className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]"
                        style={{ background: "var(--color-sage-light)" }}
                      >
                        {product.category.name}
                      </span>
                    )}
                  </motion.div>

                  {/* Name */}
                  <motion.h1
                    variants={fadeUp}
                    custom={1}
                    className="font-playfair mt-4 text-3xl font-semibold leading-tight text-[var(--color-text-primary)] lg:text-4xl"
                  >
                    {product.name}
                  </motion.h1>
                  {product.botanicalName && (
                    <motion.p
                      variants={fadeUp}
                      custom={2}
                      className="mt-1.5 text-sm italic text-[var(--color-brown-muted)]"
                    >
                      {product.botanicalName}
                    </motion.p>
                  )}

                  {/* Divider */}
                  <div
                    className="my-5 h-px"
                    style={{ background: "var(--color-warm-gray)" }}
                  />

                  {/* Description */}
                  {product.description && (
                    <motion.p
                      variants={fadeUp}
                      custom={3}
                      className="text-sm leading-7 text-[var(--color-text-muted)]"
                    >
                      {product.description}
                    </motion.p>
                  )}

                  {/* Info rows */}
                  {(product.origin || product.extractionMethod) && (
                    <motion.div
                      variants={stagger}
                      initial="hidden"
                      animate="visible"
                      className="mt-6 grid gap-2 sm:grid-cols-2"
                    >
                      {product.origin && (
                        <InfoRow
                          icon={MapPin}
                          label="Origin"
                          value={product.origin}
                        />
                      )}
                      {product.extractionMethod && (
                        <InfoRow
                          icon={FlaskConical}
                          label="Extraction Method"
                          value={product.extractionMethod}
                        />
                      )}
                    </motion.div>
                  )}

                  {/* CTAs */}
                  <motion.div
                    variants={fadeUp}
                    custom={5}
                    className="mt-8 flex flex-wrap gap-3"
                  >
                    <button
                      type="button"
                      onClick={openInquiry}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Phone size={15} /> Get a Quote
                    </button>
                    <button
                      type="button"
                      onClick={openInquiry}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <PhoneCall size={15} /> Request Call Back
                    </button>
                    <button
                      type="button"
                      onClick={openBrochure}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Download size={15} /> Download Catalogue
                    </button>
                  </motion.div>

                  {/* Trust strip */}
                  <motion.div
                    variants={fadeUp}
                    custom={6}
                    className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--color-warm-gray)] bg-[var(--color-off-white)] px-5 py-3"
                  >
                    {[
                      { icon: Leaf, label: "100% Natural" },
                      { icon: Sparkles, label: "Premium Grade" },
                      { icon: CheckCircle2, label: "Lab Certified" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]"
                      >
                        <Icon
                          size={13}
                          style={{ color: "var(--color-sage-dark)" }}
                        />
                        {label}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* ── Specifications ────────────────────────── */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={stagger}
                className="mt-10"
              >
                <motion.div
                  variants={fadeUp}
                  className="mb-5 flex items-center gap-3"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-xl"
                    style={{ background: "var(--color-sage-light)" }}
                  >
                    <ClipboardList
                      size={15}
                      style={{ color: "var(--color-sage-dark)" }}
                    />
                  </div>
                  <h2 className="font-playfair text-xl font-semibold text-[var(--color-text-primary)]">
                    Specifications
                  </h2>
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  className="overflow-hidden rounded-2xl border border-[var(--color-warm-gray)] bg-white"
                >
                  {[
                    { label: "Product Name", value: product.name },
                    { label: "Botanical Name", value: product.botanicalName },
                    { label: "Category", value: product.category?.name },
                    { label: "Origin", value: product.origin },
                    {
                      label: "Extraction Method",
                      value: product.extractionMethod,
                    },
                    {
                      label: "Availability",
                      value: product.featured
                        ? "Featured / In Demand"
                        : "In Stock",
                    },
                  ]
                    .filter((row) => row.value)
                    .map((row, i, arr) => (
                      <div
                        key={row.label}
                        className={`flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4 ${
                          i < arr.length - 1
                            ? "border-b border-[var(--color-warm-gray)]"
                            : ""
                        } ${i % 2 === 1 ? "bg-[var(--color-off-white)]" : ""}`}
                      >
                        <span className="w-full text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] sm:w-48 sm:shrink-0">
                          {row.label}
                        </span>
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">
                          {row.value}
                        </span>
                      </div>
                    ))}
                </motion.div>
              </motion.section>

              {/* ── Benefits ───────────────────────────────── */}
              {product.benefits?.length > 0 && (
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={stagger}
                  className="mt-10"
                >
                  <motion.div
                    variants={fadeUp}
                    className="mb-5 flex items-center gap-3"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-xl"
                      style={{ background: "var(--color-sage-light)" }}
                    >
                      <CheckCircle2
                        size={15}
                        style={{ color: "var(--color-sage-dark)" }}
                      />
                    </div>
                    <h2 className="font-playfair text-xl font-semibold text-[var(--color-text-primary)]">
                      Key Benefits
                    </h2>
                  </motion.div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {product.benefits.map((item, i) => (
                      <BenefitCard key={item} text={item} index={i} />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* ── Uses ──────────────────────────────────── */}
              {product.uses?.length > 0 && (
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={stagger}
                  className="mt-10"
                >
                  <motion.div
                    variants={fadeUp}
                    className="mb-5 flex items-center gap-3"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-xl"
                      style={{ background: "var(--color-off-white)" }}
                    >
                      <Zap
                        size={15}
                        style={{ color: "var(--color-brown-muted)" }}
                      />
                    </div>
                    <h2 className="font-playfair text-xl font-semibold text-[var(--color-text-primary)]">
                      How to Use
                    </h2>
                  </motion.div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {product.uses.map((item, i) => (
                      <UseCard key={item} text={item} index={i} />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* ── Additional Information (spec table from DB) ── */}
              {product.specifications?.length > 0 && (
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={stagger}
                  className="mt-10"
                >
                  <motion.div
                    variants={fadeUp}
                    className="mb-5 flex items-center gap-3"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-xl"
                      style={{ background: "var(--color-sage-light)" }}
                    >
                      <ClipboardList
                        size={15}
                        style={{ color: "var(--color-sage-dark)" }}
                      />
                    </div>
                    <h2 className="font-playfair text-xl font-semibold text-[var(--color-text-primary)]">
                      Additional Information
                    </h2>
                  </motion.div>
                  <motion.div
                    variants={fadeUp}
                    className="overflow-hidden rounded-2xl border border-[var(--color-warm-gray)] bg-white"
                  >
                    {product.specifications
                      .filter((row) => row.label && row.value)
                      .map((row, i, arr) => (
                        <div
                          key={`${row.label}-${i}`}
                          className={`flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:gap-4 ${
                            i < arr.length - 1
                              ? "border-b border-[var(--color-warm-gray)]"
                              : ""
                          } ${i % 2 === 1 ? "bg-[var(--color-off-white)]" : ""}`}
                        >
                          <span className="w-full text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] sm:w-56 sm:shrink-0">
                            {row.label}
                          </span>
                          <span className="text-sm text-[var(--color-text-primary)]">
                            {row.value}
                          </span>
                        </div>
                      ))}
                  </motion.div>
                </motion.section>
              )}

              {/* ── Product info tabs (Overview + company-wide) ── */}
              <ProductInfoTabs product={product} />

              {/* ── Related Products ──────────────────────── */}
              <RelatedProducts
                products={relatedProducts}
                categorySlug={product.category?.slug}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
