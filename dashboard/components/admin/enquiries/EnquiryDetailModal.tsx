"use client";

import AdminModal from "@/components/admin/ui/AdminModal";
import type { Enquiry } from "@/types/enquiry";

type EnquiryDetailModalProps = {
  open: boolean;
  enquiry: Enquiry | null;
  onClose: () => void;
};

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 py-2">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </dt>
      <dd className="text-sm text-[var(--text-primary)] break-words">
        {value ? value : <span className="italic opacity-50">—</span>}
      </dd>
    </div>
  );
}

export default function EnquiryDetailModal({
  open,
  enquiry,
  onClose,
}: EnquiryDetailModalProps) {
  if (!enquiry) return null;

  return (
    <AdminModal open={open} title="Enquiry details" onClose={onClose} size="lg">
      <dl className="divide-y divide-[var(--border)]">
        <Field label="Name" value={enquiry.name} />
        <Field label="Email" value={enquiry.email} />
        <Field label="Phone" value={enquiry.phone} />
        <Field label="Country" value={enquiry.country} />
        <Field label="Product" value={enquiry.category} />
        <Field label="Quantity" value={enquiry.quantity} />
        <Field label="Message" value={enquiry.message} />
        <Field label="Source" value={enquiry.source} />
        <Field label="Status" value={enquiry.status} />
        <Field label="Received" value={formatDate(enquiry.createdAt)} />
      </dl>

      <div className="mt-6 flex justify-end gap-3">
        {enquiry.email && (
          <a
            href={`mailto:${enquiry.email}`}
            className="admin-btn-secondary"
          >
            Reply by email
          </a>
        )}
        <button type="button" onClick={onClose} className="admin-btn-primary">
          Close
        </button>
      </div>
    </AdminModal>
  );
}
