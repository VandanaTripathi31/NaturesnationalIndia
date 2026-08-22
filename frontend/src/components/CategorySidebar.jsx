"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, Leaf, Star, Phone, Mail, ChevronRight } from "lucide-react";
import Skeleton from "../../src/components/ui/Skeleton";
import { categoryHref, productHref } from "../lib/seo-routes";

export default function CategorySidebar({
  categories = [],
  activeSlug = "",
  featuredProducts = [],
  showSearch = false,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const currentSlug =
    activeSlug || pathname.match(/^\/([^/]+)\.html$/)?.[1] || "";

  function handleSearchSubmit(event) {
    event.preventDefault();
    if (!currentSlug) return;

    const params = new URLSearchParams(searchParams.toString());
    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`${categoryHref(currentSlug)}?${params.toString()}`);
  }

  return (
    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      {/* ── Categories ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-[var(--color-warm-gray)] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Leaf size={14} style={{ color: "var(--color-sage-dark)" }} />
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Collections
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 rounded-xl" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {categories.map((category) => {
              const isActive = currentSlug === category.slug;
              return (
                <li key={category.id}>
                  <Link
                    href={categoryHref(category.slug)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 ${
                      isActive
                        ? "font-semibold text-[var(--color-cream-white)]"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-off-white)] hover:text-[var(--color-text-primary)]"
                    }`}
                    style={
                      isActive ? { background: "var(--gradient-btn)" } : {}
                    }
                  >
                    {category.name}
                    {isActive && <ChevronRight size={13} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Search ─────────────────────────────────────────── */}
      {showSearch && currentSlug && (
        <div className="rounded-2xl border border-[var(--color-warm-gray)] bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Search size={14} style={{ color: "var(--color-sage-dark)" }} />
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
              Search
            </h3>
          </div>
          <form onSubmit={handleSearchSubmit} className="space-y-2.5">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-brown-muted)" }}
              />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search products…"
                className="w-full rounded-xl border border-[var(--color-warm-gray)] bg-[var(--color-off-white)] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[var(--color-dark-brown)] focus:bg-white"
                style={{ color: "var(--color-text-primary)" }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full justify-center py-2.5 text-sm"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* ── Featured Products ───────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <div className="rounded-2xl border border-[var(--color-warm-gray)] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Star size={14} style={{ color: "var(--color-sage-dark)" }} />
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
              Featured
            </h3>
          </div>
          <ul className="divide-y divide-[var(--color-warm-gray)]">
            {featuredProducts.map((product) => (
              <li key={product.id}>
                <Link
                  href={productHref(
                    product.category?.slug || currentSlug,
                    product.slug,
                  )}
                  className="group flex items-start justify-between gap-2 py-3 transition hover:text-[var(--color-dark-brown)]"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-dark-brown)] transition">
                      {product.name}
                    </p>
                    {product.botanicalName && (
                      <p className="mt-0.5 text-[11px] italic text-[var(--color-brown-muted)]">
                        {product.botanicalName}
                      </p>
                    )}
                  </div>
                  <ChevronRight
                    size={14}
                    className="mt-0.5 shrink-0 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                    style={{ color: "var(--color-dark-brown)" }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Enquiry Card ────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "var(--gradient-hero)" }}
      >
        <Leaf
          size={22}
          className="mb-3"
          style={{ color: "rgba(248,245,242,0.55)" }}
        />
        <h3 className="font-playfair text-base font-semibold text-[var(--color-cream-white)]">
          Need assistance?
        </h3>
        <p
          className="mt-1.5 text-xs leading-5"
          style={{ color: "rgba(248,245,242,0.72)" }}
        >
          Our specialists are here to help you find the right botanical product.
        </p>
        <div className="mt-4 space-y-2">
          <a
            href="tel:+91 9711003901"
            className="flex items-center gap-2 text-xs text-[var(--color-cream-white)] transition hover:opacity-80"
          >
            <Phone size={12} /> +91 9711003901
          </a>
          <a
            href="mailto:info@naturesnaturalindia.com"
            className="flex items-center gap-2 text-xs text-[var(--color-cream-white)] transition hover:opacity-80"
          >
            <Mail size={12} /> info@naturesnaturalindia.com
          </a>
        </div>
        <Link
          href="/contact-us"
          className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-semibold text-[var(--color-cream-white)] transition hover:bg-white/25"
        >
          Send Enquiry <ChevronRight size={12} />
        </Link>
      </div>
    </aside>
  );
}
