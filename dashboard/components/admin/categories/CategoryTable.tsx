"use client";

import Image from "next/image";
import { Edit3, Trash2, Tag, ChevronRight } from "lucide-react";
import Skeleton from "@/components/admin/ui/Skeleton";
import type { Category } from "@/types/category";
import StatusToggle from "./StatusToggle";

type CategoryTableProps = {
  categories: Category[];
  isLoading?: boolean;
  togglingId?: string | null;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category, isActive: boolean) => void;
};

function TableSkeleton() {
  return (
    <div className="admin-table-wrap p-5">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-8 w-[72px] rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CategoryTable({
  categories,
  isLoading = false,
  togglingId = null,
  onEdit,
  onDelete,
  onToggleStatus,
}: CategoryTableProps) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (categories.length === 0) {
    return (
      <div className="admin-card flex flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-dashed px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)]">
          <Tag className="h-5 w-5 text-[var(--text-muted)]" />
        </span>
        <div>
          <p className="font-display text-base font-semibold text-[var(--text-primary)]">
            No categories found
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Try adjusting your search filters or add a new category.
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
              <th
                scope="col"
                className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]"
              >
                Category
              </th>
              <th
                scope="col"
                className="hidden px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] md:table-cell"
              >
                Slug
              </th>
              <th
                scope="col"
                className="hidden px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] lg:table-cell"
              >
                SEO Title
              </th>
              <th
                scope="col"
                className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="group transition-colors duration-100 hover:bg-[rgba(47,141,110,0.03)]"
              >
                {/* Category name + image */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[var(--surface-muted)] ring-1 ring-[var(--border)]">
                      {category.image?.url ? (
                        <Image
                          src={category.image.url}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Tag className="h-4 w-4 text-[var(--text-muted)]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 max-w-[200px]">
                      <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                        {category.name}
                      </p>
                      <p
                        className="mt-0.5 truncate text-xs text-[var(--text-muted)]"
                        title={category.description ?? ""}
                      >
                        {category.description || "No description"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Slug */}
                <td className="hidden px-5 py-4 md:table-cell">
                  <code className="rounded-md bg-[var(--surface-muted)] px-2 py-1 font-mono text-xs text-[var(--text-secondary)]">
                    {category.slug}
                  </code>
                </td>

                {/* SEO title */}
                <td className="hidden px-5 py-4 lg:table-cell">
                  <span className="text-sm text-[var(--text-muted)]">
                    {category.metaTitle || (
                      <span className="italic opacity-50">—</span>
                    )}
                  </span>
                </td>

                {/* Status toggle */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <StatusToggle
                      isActive={category.isActive}
                      disabled={togglingId === category.id}
                      onChange={(isActive) => onToggleStatus(category, isActive)}
                    />
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        category.isActive
                          ? "bg-[rgba(47,141,110,0.1)] text-[var(--brand-leaf)]"
                          : "bg-[var(--surface-muted)] text-[var(--text-muted)]",
                      ].join(" ")}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(category)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-transparent px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
