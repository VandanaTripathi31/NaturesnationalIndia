"use client";

import {
  Trash2,
  Inbox,
  MailOpen,
  Mail,
  Loader2,
  Eye,
} from "lucide-react";
import Skeleton from "@/components/admin/ui/Skeleton";
import type { Enquiry, EnquiryStatus } from "@/types/enquiry";

type EnquiryTableProps = {
  enquiries: Enquiry[];
  isLoading?: boolean;
  updatingId?: string | null;
  onView: (enquiry: Enquiry) => void;
  onDelete: (enquiry: Enquiry) => void;
  onToggleRead: (enquiry: Enquiry, status: EnquiryStatus) => void;
};

const statusStyles: Record<EnquiryStatus, string> = {
  new: "bg-[rgba(47,141,110,0.12)] text-[var(--brand-leaf)]",
  read: "bg-[var(--surface-muted)] text-[var(--text-muted)]",
  responded: "bg-[rgba(59,130,246,0.12)] text-blue-600 dark:text-blue-400",
  archived: "bg-[var(--surface-muted)] text-[var(--text-muted)]",
};

const statusLabels: Record<EnquiryStatus, string> = {
  new: "Unread",
  read: "Read",
  responded: "Responded",
  archived: "Archived",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TableSkeleton() {
  return (
    <div className="admin-table-wrap p-5">
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="hidden h-5 w-32 rounded md:block" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EnquiryTable({
  enquiries,
  isLoading = false,
  updatingId = null,
  onView,
  onDelete,
  onToggleRead,
}: EnquiryTableProps) {
  if (isLoading) return <TableSkeleton />;

  if (enquiries.length === 0) {
    return (
      <div className="admin-card flex flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-dashed px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)]">
          <Inbox className="h-5 w-5 text-[var(--text-muted)]" />
        </span>
        <div>
          <p className="font-display text-base font-semibold text-[var(--text-primary)]">
            No enquiries found
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            New website enquiries will appear here automatically.
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
              <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Contact
              </th>
              <th className="hidden px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] md:table-cell">
                Product
              </th>
              <th className="hidden px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] lg:table-cell">
                Message
              </th>
              <th className="hidden px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] sm:table-cell">
                Date
              </th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Status
              </th>
              <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {enquiries.map((enquiry) => {
              const isUnread = enquiry.status === "new";
              const busy = updatingId === enquiry._id;
              return (
                <tr
                  key={enquiry._id}
                  className={[
                    "group transition-colors duration-100 hover:bg-[rgba(47,141,110,0.03)]",
                    isUnread ? "bg-[rgba(47,141,110,0.04)]" : "",
                  ].join(" ")}
                >
                  {/* Contact */}
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <p
                        className={[
                          "truncate text-sm text-[var(--text-primary)]",
                          isUnread ? "font-bold" : "font-semibold",
                        ].join(" ")}
                      >
                        {enquiry.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                        {enquiry.email}
                        {enquiry.phone ? ` · ${enquiry.phone}` : ""}
                      </p>
                    </div>
                  </td>

                  {/* Product / category */}
                  <td className="hidden px-5 py-4 md:table-cell">
                    {enquiry.category ? (
                      <span className="inline-flex items-center rounded-lg bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                        {enquiry.category}
                      </span>
                    ) : (
                      <span className="text-sm italic text-[var(--text-muted)] opacity-50">
                        —
                      </span>
                    )}
                  </td>

                  {/* Message preview */}
                  <td className="hidden px-5 py-4 lg:table-cell">
                    <p
                      className="max-w-[240px] truncate text-sm text-[var(--text-muted)]"
                      title={enquiry.message ?? ""}
                    >
                      {enquiry.message || (
                        <span className="italic opacity-50">No message</span>
                      )}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="hidden whitespace-nowrap px-5 py-4 text-sm text-[var(--text-muted)] sm:table-cell">
                    {formatDate(enquiry.createdAt)}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        statusStyles[enquiry.status],
                      ].join(" ")}
                    >
                      {statusLabels[enquiry.status]}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onView(enquiry)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-muted)]"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        View
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          onToggleRead(enquiry, isUnread ? "read" : "new")
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-muted)] disabled:opacity-60"
                      >
                        {busy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isUnread ? (
                          <MailOpen className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {isUnread ? "Mark read" : "Mark unread"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(enquiry)}
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
