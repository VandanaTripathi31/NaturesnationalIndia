type AdminPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  label: string;
  isLoading?: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export default function AdminPagination({
  page,
  totalPages,
  total,
  label,
  isLoading = false,
  onPrevious,
  onNext,
}: AdminPaginationProps) {
  return (
    <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[var(--text-muted)]">
        Page {page} of {totalPages} · {total} {label}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1 || isLoading}
          onClick={onPrevious}
          className="admin-btn-secondary disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages || isLoading}
          onClick={onNext}
          className="admin-btn-secondary disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </section>
  );
}
