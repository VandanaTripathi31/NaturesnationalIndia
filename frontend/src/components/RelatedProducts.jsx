import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import { categoryHref, productHref } from "../lib/seo-routes";
import { resolveImageUrl } from "../lib/image-url";

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

function RelatedCard({ product, index, categorySlug }) {
  const imageUrl = resolveImageUrl(product.images?.[0]?.url);
  return (
    <motion.div variants={fadeUp} custom={index}>
      <Link
        href={productHref(product.category?.slug || categorySlug, product.slug)}
        className="group block overflow-hidden rounded-2xl border border-[var(--color-warm-gray)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      >
        {/* Image */}
        <div
          className="relative aspect-square overflow-hidden"
          style={{ background: "var(--color-sage-light)" }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-600 ease-out group-hover:scale-107"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Leaf size={24} style={{ color: "var(--color-brown-muted)" }} />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brown-deep)]/50 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-playfair text-base font-semibold leading-snug text-[var(--color-text-primary)] transition group-hover:text-[var(--color-dark-brown)]">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {product.category?.name ?? "Product"}
          </p>
          <p className="mt-3 flex items-center gap-1 text-xs font-medium text-[var(--color-dark-brown)] transition group-hover:gap-2">
            View Product <ArrowRight size={12} />
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function RelatedProducts({
  products = [],
  title = "Related Products",
  categorySlug = "",
}) {
  if (!products.length) return null;

  const viewAllHref = categoryHref(categorySlug);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={stagger}
      className="mt-14"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="mb-7 flex items-end justify-between"
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-brown-muted)]">
            Discover More
          </p>
          <h2 className="font-playfair mt-1 text-2xl font-semibold text-[var(--color-text-primary)]">
            {title}
          </h2>
        </div>
        <Link
          href={viewAllHref}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-dark-brown)] transition hover:gap-2.5"
        >
          View All <ArrowRight size={13} />
        </Link>
      </motion.div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product, i) => (
          <RelatedCard
            key={product.id}
            product={product}
            index={i}
            categorySlug={categorySlug}
          />
        ))}
      </div>
    </motion.section>
  );
}
