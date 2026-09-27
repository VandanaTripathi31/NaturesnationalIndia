"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

type AdminModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
};

const sizeClasses = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
};

export default function AdminModal({
  open,
  title,
  description,
  onClose,
  children,
  size = "lg",
}: AdminModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-[#3e2b1e]/45 backdrop-blur-sm"
        aria-label="Close modal overlay"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-3xl admin-card ${sizeClasses[size]}`}
      >
        <div className="flex items-start justify-between border-b border-[var(--border)] px-6 py-5">
          <div>
            <h2 className="font-display text-2xl text-[var(--text-primary)]">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)]"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </motion.div>
    </div>
  );
}
