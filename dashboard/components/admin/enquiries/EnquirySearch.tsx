"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import type { EnquiryStatus } from "@/types/enquiry";

type StatusFilter = "all" | EnquiryStatus;

type EnquirySearchProps = {
  value: string;
  status: StatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: StatusFilter) => void;
  onSubmit: () => void;
  isLoading?: boolean;
};

function IconSelect({
  icon: Icon,
  value,
  onChange,
  children,
  width = "180px",
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
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function EnquirySearch({
  value,
  status,
  onSearchChange,
  onStatusChange,
  onSubmit,
  isLoading = false,
}: EnquirySearchProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
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
          placeholder="Search by name, email, phone, product…"
          className="admin-input py-2.5 pl-[2.375rem] pr-4 text-sm"
        />
      </div>

      <IconSelect
        icon={SlidersHorizontal}
        value={status}
        onChange={(v) => onStatusChange(v as StatusFilter)}
        width="180px"
      >
        <option value="all">All statuses</option>
        <option value="new">Unread</option>
        <option value="read">Read</option>
        <option value="responded">Responded</option>
        <option value="archived">Archived</option>
      </IconSelect>

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
