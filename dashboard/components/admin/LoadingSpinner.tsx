import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  label?: string;
  className?: string;
};

export default function LoadingSpinner({
  label = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex min-h-[240px] flex-col items-center justify-center gap-3 text-slate-500 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" aria-hidden="true" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
