"use client";

import { Loader2 } from "lucide-react";
import AdminModal from "@/components/admin/ui/AdminModal";
import type { Category } from "@/types/category";

type DeleteCategoryModalProps = {
  open: boolean;
  category: Category | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteCategoryModal({
  open,
  category,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteCategoryModalProps) {
  if (!category) return null;

  return (
    <AdminModal open={open} title="Delete category" onClose={onClose} size="md">
      <p className="text-sm text-[var(--text-muted)]">
        Are you sure you want to delete{" "}
        <span className="font-medium text-[var(--text-primary)]">{category.name}</span>?
        This action cannot be undone and will remove the category image from Cloudinary.
      </p>

      <div className="mt-6 flex items-center justify-end gap-3">
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
          {isDeleting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Delete category
        </button>
      </div>
    </AdminModal>
  );
}
