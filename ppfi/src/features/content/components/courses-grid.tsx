"use client";

import { useMemo, useState } from "react";

import { CourseCard } from "@/components/marketing/course-card";
import { cn } from "@/lib/utils";
import type { Course } from "@/features/content";

export function CoursesGrid({
  courses,
  categories,
}: {
  courses: Course[];
  categories: string[];
}) {
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(
    () => (active === "All" ? courses : courses.filter((c) => c.category === active)),
    [active, courses],
  );

  const filters = ["All", ...categories];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active === f
                ? "border-transparent bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}
