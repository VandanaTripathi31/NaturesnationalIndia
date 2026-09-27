"use client";

import Image from "next/image";
import { Edit3, Trash2, Package, Star } from "lucide-react";
import Skeleton from "@/components/admin/ui/Skeleton";
import { normalizeProductImages } from "@/lib/product-images";
import type { Product } from "@/types/product";
import StatusToggle from "@/components/admin/categories/StatusToggle";
import FeaturedToggle from "./FeaturedToggle";

type ProductTableProps = {
  products: Product[];
  isLoading?: boolean;
  togglingId?: string | null;
  featuringId?: string | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStatus: (product: Product, isActive: boolean) => void;
  onToggleFeatured: (product: Product, featured: boolean) => void;
};

function TableSkeleton() {
  return (
    <div className="admin-table-wrap p-5">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="hidden h-5 w-20 rounded-full md:block" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-8 w-[72px] rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductTable({
  products,
  isLoading = false,
  togglingId = null,
  featuringId = null,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
}: ProductTableProps) {
  if (isLoading) return <TableSkeleton />;

  if (products.length === 0) {
    return (
      <div className="admin-card flex flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-dashed px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)]">
          <Package className="h-5 w-5 text-[var(--text-muted)]" />
        </span>
        <div>
          <p className="font-display text-base font-semibold text-[var(--text-primary)]">
            No products found
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Try adjusting your filters or add a new product.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr
              className="border-b border-[var(--border-strong)]"
              style={{ background: "rgba(47,141,110,0.08)" }}
            >
              <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Product
              </th>
              <th scope="col" className="hidden px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] md:table-cell">
                Category
              </th>
              <th scope="col" className="hidden px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] lg:table-cell">
                Description
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Featured
              </th>
              <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {products.map((product) => {
              const images = normalizeProductImages(product.images);
              const thumbnail = images[0]?.url;

              return (
                <tr
                  key={product.id}
                  className="group transition-colors duration-100 hover:bg-[rgba(47,141,110,0.03)]"
                >
                  {/* Product name + image */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[var(--surface-muted)] ring-1 ring-[var(--border)]">
                        {thumbnail ? (
                          <Image src={thumbnail} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-4 w-4 text-[var(--text-muted)]" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                          {product.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="hidden px-5 py-4 md:table-cell">
                    {product.category?.name ? (
                      <span className="inline-flex items-center rounded-lg bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                        {product.category.name}
                      </span>
                    ) : (
                      <span className="text-sm italic text-[var(--text-muted)] opacity-50">—</span>
                    )}
                  </td>

                  {/* Description — truncated to 1 line */}
                  <td className="hidden px-5 py-4 lg:table-cell">
                    <p
                      className="max-w-[220px] truncate text-sm text-[var(--text-muted)]"
                      title={product.description ?? ""}
                    >
                      {product.description || <span className="italic opacity-50">No description</span>}
                    </p>
                  </td>

                  {/* Featured toggle */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <FeaturedToggle
                        featured={product.featured}
                        disabled={featuringId === product.id}
                        onChange={(featured) => onToggleFeatured(product, featured)}
                      />
                      {product.featured && (
                        <Star className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                      )}
                    </div>
                  </td>

                  {/* Status toggle */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <StatusToggle
                        isActive={product.isActive}
                        disabled={togglingId === product.id}
                        onChange={(isActive) => onToggleStatus(product, isActive)}
                      />
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          product.isActive
                            ? "bg-[rgba(47,141,110,0.1)] text-[var(--brand-leaf)]"
                            : "bg-[var(--surface-muted)] text-[var(--text-muted)]",
                        ].join(" ")}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-muted)]"
                      >
                        <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-transparent px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
