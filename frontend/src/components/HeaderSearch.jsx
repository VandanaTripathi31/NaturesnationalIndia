"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, X } from "lucide-react";
import { searchProducts } from "../services/productService";
import { productHref } from "../lib/seo-routes";
import { resolveImageUrl } from "../lib/image-url";

/*
  Header product search with live suggestions.

  - Debounces keystrokes (250ms) and aborts the previous in-flight request
    so fast typing never floods the API or races stale results in.
  - Only queries for 2+ characters (matches the backend guard).
  - Suggestions link to the canonical product URL via `productHref`, so SEO
    routing stays the single source of truth.
  - Fully keyboard + pointer accessible; closes on outside click / Escape.

  `variant="mobile"` renders full-width for the mobile drawer; the default
  renders the compact desktop-header version.
*/
export default function HeaderSearch({ variant = "desktop", onNavigate }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const containerRef = useRef(null);
  const abortRef = useRef(null);

  // Debounced fetch — one timer per keystroke, previous request aborted.
  useEffect(() => {
    const term = query.trim();

    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      setSearchError(false);
      abortRef.current?.abort();
      return;
    }

    setLoading(true);
    setSearchError(false);
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const products = await searchProducts(term, {
          limit: 8,
          signal: controller.signal,
        });
        setResults(products);
        setSearchError(false);
        setActive(-1);
      } catch (err) {
        // A genuinely aborted request (superseded by a newer keystroke) is
        // expected and silent. Anything else — network failure, CORS,
        // backend down, wrong API base URL — was previously indistinguishable
        // from "search ran and found nothing" (both rendered "No products
        // found."). This is the ONLY client-side, browser-initiated
        // cross-origin request in the whole app (every other product/
        // category page is fetched server-side during SSR, which CORS never
        // touches) — so it's uniquely exposed to a CORS/base-URL
        // misconfiguration nothing else would surface. Now a real failure
        // shows a distinct "Unable to load results" message instead of
        // silently looking like a genuine zero-result search.
        if (err?.name !== "AbortError" && err?.code !== "ERR_CANCELED") {
          console.error("[search] Request failed:", err);
          setResults([]);
          setSearchError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click.
  useEffect(() => {
    const handler = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goToProduct = useCallback(
    (product) => {
      const href = productHref(product.category?.slug, product.slug);
      setOpen(false);
      setQuery("");
      setResults([]);
      onNavigate?.();
      router.push(href);
    },
    [router, onNavigate],
  );

  const handleKeyDown = (event) => {
    if (!open || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      goToProduct(results[active >= 0 ? active : 0]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  // FIX: this previously required `loading || results.length > 0` to show
  // the dropdown at all — meaning the instant a search legitimately
  // finished with zero matches (or the request errored, see the catch
  // above), the dropdown closed itself and the "No products found."
  // message a few lines down became unreachable dead code. The user
  // typing a real product name that (for whatever reason) came back
  // empty saw nothing at all, indistinguishable from the search being
  // broken. Now the dropdown stays open for the whole "actively
  // searching" state (query long enough + focused), and its *contents*
  // (spinner / results / empty message) are what react to loading/results.
  const showDropdown = open && query.trim().length >= 2;
  const isMobile = variant === "mobile";

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        // Fluid width: full 280px at wide viewports, compacting down to
        // 110px by the ~1130px hamburger cutoff instead of overflowing.
        width: isMobile ? "100%" : "clamp(110px, 13vw, 280px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#fff",
          border: "1px solid rgba(196,168,130,0.4)",
          borderRadius: 100,
          padding: isMobile ? "10px 14px" : "7px 14px",
          transition: "border-color 0.18s, box-shadow 0.18s",
        }}
      >
        <Search size={16} style={{ color: "var(--color-brown-muted, #8B6650)", flexShrink: 0 }} />
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products…"
          aria-label="Search products"
          autoComplete="off"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 13.5,
            color: "var(--color-text-primary, #3a2c1a)",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            minWidth: 0,
          }}
        />
        {loading ? (
          <Loader2 size={15} className="hs-spin" style={{ color: "var(--color-brown-muted, #8B6650)", flexShrink: 0 }} />
        ) : query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            style={{ display: "flex", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <X size={15} style={{ color: "var(--color-brown-muted, #8B6650)" }} />
          </button>
        ) : null}
      </div>

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            zIndex: 3000,
            background: "#fff",
            border: "1px solid rgba(196,168,130,0.25)",
            borderTop: "3px solid var(--color-brown-light, #C4A882)",
            borderRadius: "0 0 10px 10px",
            boxShadow: "0 16px 40px rgba(62,43,30,0.16)",
            maxHeight: 380,
            overflowY: "auto",
          }}
        >
          {loading ? (
            <div style={{ padding: "16px 18px", fontSize: 13, color: "var(--color-text-muted, #8a7a68)" }}>
              Searching…
            </div>
          ) : searchError ? (
            <div style={{ padding: "16px 18px", fontSize: 13, color: "#b91c1c" }}>
              Unable to load results. Please check your connection and try
              again.
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: "16px 18px", fontSize: 13, color: "var(--color-text-muted, #8a7a68)" }}>
              No products found.
            </div>
          ) : (
            results.map((product, i) => {
              const imageUrl = resolveImageUrl(product.image);
              return (
              <Link
                key={product.id}
                href={productHref(product.category?.slug, product.slug)}
                onClick={(event) => {
                  event.preventDefault();
                  goToProduct(product);
                }}
                onMouseEnter={() => setActive(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 16px",
                  textDecoration: "none",
                  background: i === active ? "#faf6ee" : "transparent",
                  borderBottom:
                    i < results.length - 1 ? "1px solid rgba(196,168,130,0.12)" : "none",
                  transition: "background 0.12s",
                }}
              >
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt=""
                    width={40}
                    height={40}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      objectFit: "cover",
                      flexShrink: 0,
                      background: "#f2ece0",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: "#f2ece0",
                    }}
                  />
                )}
                <span style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "var(--color-text-primary, #3a2c1a)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {product.name}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: 11.5,
                      color: "var(--color-text-muted, #8a7a68)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {product.botanicalName || product.category?.name}
                  </span>
                </span>
              </Link>
              );
            })
          )}
        </div>
      )}

      <style>{`
        .hs-spin { animation: hs-spin 0.7s linear infinite; }
        @keyframes hs-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
