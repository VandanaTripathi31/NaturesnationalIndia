import Skeleton from "@/components/ui/Skeleton";

export function CategoryPageSkeleton() {
  return (
    <div className="bg-[#faf6ee] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Skeleton className="mb-6 h-4 w-64" />
        <Skeleton className="mb-8 h-56 w-full rounded-2xl" />
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <Skeleton className="h-80 rounded-2xl" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-72 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="bg-[#faf6ee] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Skeleton className="mb-6 h-4 w-72" />
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-[520px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
