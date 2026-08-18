"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, BookOpen } from "lucide-react";
import { useState } from "react";
import BlogCard from "./BlogCard";
import Breadcrumb from "../Breadcrumb";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function BlogListView({ blogs, pagination, searchQuery }) {
  const router = useRouter();
  const [query, setQuery] = useState(searchQuery || "");

  const buildPageHref = (page) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    const qs = params.toString();
    router.push(qs ? `/blog?${qs}` : "/blog");
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "var(--color-cream-white)" }}>
      {/* Hero */}
      <section
        className="relative w-full overflow-hidden px-6 py-16 sm:px-10 lg:px-16"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-7xl">
          <Breadcrumb items={[{ label: "Blog" }]} />
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.h1
              variants={fadeUp}
              className="font-playfair"
              style={{
                fontSize: "clamp(1.9rem, 3.8vw, 3rem)",
                fontWeight: 600,
                lineHeight: 1.15,
                color: "var(--color-cream-white)",
                margin: 0,
              }}
            >
              Natures Natural India Blog
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-[15px]"
              style={{ color: "rgba(248,245,242,0.85)" }}
            >
              Insights on essential oils, carrier oils, hydrosols and natural
              ingredient sourcing — for buyers, formulators and wellness
              brands worldwide.
            </motion.p>

            <motion.form
              variants={fadeUp}
              onSubmit={handleSearchSubmit}
              className="mt-6 flex max-w-md items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-sm"
            >
              <Search size={16} className="text-[var(--color-brown-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="w-full bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
              />
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-playfair text-2xl font-semibold text-[var(--color-text-primary)]">
              {blogs.length > 0
                ? `${pagination?.total ?? blogs.length} Articles`
                : "No Articles Found"}
            </h2>
            {searchQuery && (
              <span className="rounded-full border border-[var(--color-warm-gray)] px-4 py-1.5 text-xs text-[var(--color-text-muted)]">
                Search: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

          {blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--color-warm-gray)] bg-white/60 py-20 text-center">
              <BookOpen size={36} className="mb-4" style={{ color: "var(--color-brown-muted)" }} />
              <p className="text-sm text-[var(--color-text-muted)]">
                No articles found.
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
            >
              {blogs.map((blog, i) => (
                <BlogCard key={blog.id} blog={blog} index={i} />
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-1.5">
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

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((n) =>
                n === pagination.page ? (
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
              )}

              {pagination.page < pagination.pages ? (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
