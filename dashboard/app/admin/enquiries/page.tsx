"use client";

import { useCallback, useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import toast from "react-hot-toast";
import EnquirySearch from "@/components/admin/enquiries/EnquirySearch";
import EnquiryTable from "@/components/admin/enquiries/EnquiryTable";
import EnquiryDetailModal from "@/components/admin/enquiries/EnquiryDetailModal";
import DeleteEnquiryModal from "@/components/admin/enquiries/DeleteEnquiryModal";
import AdminPagination from "@/components/admin/ui/AdminPagination";
import { enquiryService } from "@/services/enquiryService";
import type {
  Enquiry,
  EnquiryPagination,
  EnquiryStatus,
} from "@/types/enquiry";

type StatusFilter = "all" | EnquiryStatus;

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [pagination, setPagination] = useState<EnquiryPagination>({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchEnquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await enquiryService.list({
        page: pagination.page,
        limit: pagination.limit,
        q: searchQuery || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setEnquiries(data.enquiries);
      setPagination((c) => ({
        ...c,
        total: data.total,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load enquiries",
      );
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, statusFilter]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  function handleView(enquiry: Enquiry) {
    setSelected(enquiry);
    setIsDetailOpen(true);
    // Opening an unread enquiry marks it as read automatically.
    if (enquiry.status === "new") {
      handleToggleRead(enquiry, "read", { silent: true });
    }
  }

  async function handleToggleRead(
    enquiry: Enquiry,
    status: EnquiryStatus,
    options: { silent?: boolean } = {},
  ) {
    setUpdatingId(enquiry._id);
    try {
      await enquiryService.updateStatus(enquiry._id, status);
      setEnquiries((list) =>
        list.map((item) =>
          item._id === enquiry._id ? { ...item, status } : item,
        ),
      );
      if (!options.silent) {
        toast.success(
          status === "read" ? "Marked as read" : "Marked as unread",
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update enquiry",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteConfirm() {
    if (!selected) return;
    setIsDeleting(true);
    try {
      await enquiryService.remove(selected._id);
      toast.success("Enquiry deleted");
      setIsDeleteOpen(false);
      setSelected(null);
      if (enquiries.length === 1 && pagination.page > 1) {
        setPagination((c) => ({ ...c, page: c.page - 1 }));
      } else {
        await fetchEnquiries();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete enquiry",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6 px-1 pb-8 pt-1">
      {/* Page header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "var(--gradient-primary)" }}
            aria-hidden="true"
          >
            <Inbox className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              Enquiries
            </h2>
            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
              Website enquiries submitted through the contact and inquiry forms.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      {!isLoading && pagination.total > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <Inbox className="h-3.5 w-3.5 text-[var(--brand-leaf)]" aria-hidden="true" />
            {pagination.total} {pagination.total === 1 ? "enquiry" : "enquiries"} total
          </span>
          {statusFilter !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
              Filtered: <span className="font-semibold text-[var(--text-primary)]">{statusFilter}</span>
            </span>
          )}
        </div>
      )}

      {/* Search / filter bar */}
      <section className="admin-card rounded-[1.25rem] px-5 py-4">
        <EnquirySearch
          value={searchInput}
          status={statusFilter}
          onSearchChange={setSearchInput}
          onStatusChange={(status) => {
            setStatusFilter(status);
            setPagination((c) => ({ ...c, page: 1 }));
          }}
          onSubmit={() => {
            setSearchQuery(searchInput.trim());
            setPagination((c) => ({ ...c, page: 1 }));
          }}
          isLoading={isLoading}
        />
      </section>

      {/* Table */}
      <EnquiryTable
        enquiries={enquiries}
        isLoading={isLoading}
        updatingId={updatingId}
        onView={handleView}
        onDelete={(enquiry) => {
          setSelected(enquiry);
          setIsDeleteOpen(true);
        }}
        onToggleRead={(enquiry, status) => handleToggleRead(enquiry, status)}
      />

      <AdminPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        label="enquiries"
        isLoading={isLoading}
        onPrevious={() => setPagination((c) => ({ ...c, page: c.page - 1 }))}
        onNext={() => setPagination((c) => ({ ...c, page: c.page + 1 }))}
      />

      <EnquiryDetailModal
        open={isDetailOpen}
        enquiry={selected}
        onClose={() => {
          setIsDetailOpen(false);
          setSelected(null);
        }}
      />

      <DeleteEnquiryModal
        open={isDeleteOpen}
        enquiry={selected}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelected(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
