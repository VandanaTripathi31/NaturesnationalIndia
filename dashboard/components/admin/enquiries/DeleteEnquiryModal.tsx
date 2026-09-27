"use client";

import { Loader2 } from "lucide-react";
import AdminModal from "@/components/admin/ui/AdminModal";
import type { Enquiry } from "@/types/enquiry";

type DeleteEnquiryModalProps = {
  open: boolean;
  enquiry: Enquiry | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteEnquiryModal({
  open,
  enquiry,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteEnquiryModalProps) {
  if (!enquiry) return null;

  return (
    <AdminModal open={open} title="Delete enquiry" onClose={onClose} size="md">
      <p className="text-sm text-[var(--text-muted)]">
        Delete the enquiry from{" "}
        <span className="font-medium text-[var(--text-primary)]">
          {enquiry.name}
        </span>
        {enquiry.email ? ` (${enquiry.email})` : ""}? This action cannot be
        undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="admin-btn-secondary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
          Delete enquiry
        </button>
      </div>
    </AdminModal>
  );
}
