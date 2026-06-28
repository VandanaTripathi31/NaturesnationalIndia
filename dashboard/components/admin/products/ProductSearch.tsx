"use client";

import { Search, SlidersHorizontal, Tag } from "lucide-react";
import type { Category } from "@/types/category";

type ProductSearchProps = {
  value: string;
  status: "all" | "active" | "inactive";
  categoryId: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onStatusChange: (status: "all" | "active" | "inactive") => void;
  onCategoryChange: (categoryId: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
};

function IconSelect({
  icon: Icon,
  value,
  onChange,
  children,
  width = "160px",
}: {
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <div className="relative shrink-0">
      <Icon
        className="pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[var(--text-muted)]"
        aria-hidden="true"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input w-full appearance-none py-2.5 pl-[2.375rem] pr-8 text-sm"
        style={{ backgroundImage: "none", width }}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]"
        viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function ProductSearch({
  value,
  status,
  categoryId,
  categories,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onSubmit,
  isLoading = false,
}: ProductSearchProps) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[var(--text-muted)]"
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, botanical name, origin…"
          className="admin-input py-2.5 pl-[2.375rem] pr-4 text-sm"
        />
      </div>

      <IconSelect icon={Tag} value={categoryId} onChange={onCategoryChange} width="190px">
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </IconSelect>

      <IconSelect
        icon={SlidersHorizontal}
        value={status}
        onChange={(v) => onStatusChange(v as "all" | "active" | "inactive")}
        width="160px"
      >
        <option value="all">All statuses</option>
        <option value="active">Active only</option>
        <option value="inactive">Inactive only</option>
      </IconSelect>

      <button type="submit" disabled={isLoading} className="admin-btn-primary shrink-0 py-2.5 text-sm">
        {isLoading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
