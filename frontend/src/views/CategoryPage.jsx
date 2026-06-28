import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb.jsx";
import CategorySidebar from "../components/CategorySidebar.jsx";
import SeoHead from "../components/SeoHead.jsx";
import { publicApi } from "../lib/api.js";

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    setIsLoading(true);
    setError("");

    publicApi
      .getCategoryBySlug(slug, {
        page,
        limit: 12,
        search: searchParams.get("search") ?? "",
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [slug, page, searchParams]);

  const category = data?.category;
  const products = data?.products ?? [];
  const pagination = data?.pagination;

  return (
    <div className="bg-[#faf6ee] px-4 py-10 sm:px-6 lg:px-10">
      <SeoHead
        title={category?.metaTitle || `${category?.name ?? "Category"} | Natures National`}
        description={category?.metaDescription || category?.description}
        keywords={category?.metaKeywords}
      />

      <div className="mx-auto max-w-7xl">
        <Breadcrumb
          items={[{ label: category?.name ?? "Category" }]}
        />

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <CategorySidebar />

          <section>
            <div className="mb-8 rounded-2xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-[#2C1A0E]">
                    {category?.name ?? "Category"}
                  </h1>
                  {category?.description && (
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-[#5C3A1E]">
                      {category.description}
                    </p>
                  )}
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const next = new URLSearchParams(searchParams);
                    if (searchInput.trim()) {
                      next.set("search", searchInput.trim());
                    } else {
                      next.delete("search");
                    }
                    next.set("page", "1");
                    setSearchParams(next);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search products..."
                    className="rounded-xl border border-[#E8DCC8] px-3 py-2 text-sm outline-none focus:border-[#3B7D4A]"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[#3B7D4A] px-4 py-2 text-sm font-medium text-white"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

            {isLoading ? (
              <p className="text-sm text-[#9C6B3C]">Loading products...</p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : products.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[#E8DCC8] bg-white p-10 text-center text-sm text-[#9C6B3C]">
                No products found in this category.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    className="overflow-hidden rounded-2xl border border-[#E8DCC8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-[#F5EFE6]">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#9C6B3C]">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="font-semibold text-[#2C1A0E]">{product.name}</h2>
                      {product.botanicalName && (
                        <p className="mt-1 text-xs italic text-[#9C6B3C]">
                          {product.botanicalName}
                        </p>
                      )}
                      {product.featured && (
                        <span className="mt-2 inline-block rounded-full bg-[#3B7D4A]/10 px-2 py-0.5 text-xs font-medium text-[#3B7D4A]">
                          Featured
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-[#9C6B3C]">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={pagination.page <= 1}
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.set("page", String(pagination.page - 1));
                      setSearchParams(next);
                    }}
                    className="rounded-lg border border-[#E8DCC8] px-3 py-2 text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.set("page", String(pagination.page + 1));
                      setSearchParams(next);
                    }}
                    className="rounded-lg border border-[#E8DCC8] px-3 py-2 text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
