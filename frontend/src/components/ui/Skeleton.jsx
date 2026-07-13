export default function Skeleton({ className = "h-4 w-full" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#E8DCC8]/60 ${className}`}
      aria-hidden="true"
    />
  );
}
