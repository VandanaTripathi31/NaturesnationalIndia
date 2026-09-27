"use client";

type FeaturedToggleProps = {
  featured: boolean;
  onChange: (featured: boolean) => void;
  disabled?: boolean;
};

export default function FeaturedToggle({
  featured,
  onChange,
  disabled = false,
}: FeaturedToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={featured}
      disabled={disabled}
      onClick={() => onChange(!featured)}
      className={[
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full",
        "transition-colors duration-200 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--surface)]",
        featured
          ? "bg-amber-400"
          : "bg-[var(--brand-warm-gray)] dark:bg-[rgba(255,255,255,0.12)]",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm",
          "transition-transform duration-200",
          featured ? "translate-x-[18px]" : "translate-x-[3px]",
        ].join(" ")}
      />
      <span className="sr-only">{featured ? "Featured" : "Not featured"}</span>
    </button>
  );
}
