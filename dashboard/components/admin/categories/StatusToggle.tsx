"use client";

type StatusToggleProps = {
  isActive: boolean;
  onChange: (isActive: boolean) => void;
  disabled?: boolean;
};

export default function StatusToggle({
  isActive,
  onChange,
  disabled = false,
}: StatusToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      disabled={disabled}
      onClick={() => onChange(!isActive)}
      className={[
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full",
        "transition-colors duration-200 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--brand-leaf)] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--surface)]",
        isActive
          ? "bg-[var(--brand-leaf)]"
          : "bg-[var(--brand-warm-gray)] dark:bg-[rgba(255,255,255,0.12)]",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm",
          "transition-transform duration-200",
          isActive ? "translate-x-[18px]" : "translate-x-[3px]",
        ].join(" ")}
      />
      <span className="sr-only">{isActive ? "Active" : "Inactive"}</span>
    </button>
  );
}
