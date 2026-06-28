"use client";

import { Search, SlidersHorizontal } from "lucide-react";

type CategorySearchProps = {
  value: string;
  status: "all" | "active" | "inactive";
  onSearchChange: (value: string) => void;
  onStatusChange: (status: "all" | "active" | "inactive") => void;
  onSubmit: () => void;
  isLoading?: boolean;
};

export default function CategorySearch({
  value,
  status,
  onSearchChange,
  onStatusChange,
  onSubmit,
  isLoading = false,
}: CategorySearchProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      {/* Search input */}
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[var(--text-muted)]"
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="         Search by name, slug, or SEO fields…"
          className="admin-input py-2.5 pl-[2.375rem] pr-4 text-sm"
        />
      </div>

      {/* Status filter */}
      <div className="relative shrink-0">
        <SlidersHorizontal
          className="pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[var(--text-muted)]"
          aria-hidden="true"
        />
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as "all" | "active" | "inactive")
          }
          className="admin-input w-full appearance-none py-2.5 pl-[2.375rem] pr-8 text-sm sm:w-[172px]"
          style={{ backgroundImage: "none" }}
        >
          <option value="all">    All statuses</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>
        {/* Custom chevron */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Search button */}
      <button
        type="submit"
        disabled={isLoading}
        className="admin-btn-primary shrink-0 py-2.5 text-sm"
      >
        {isLoading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
