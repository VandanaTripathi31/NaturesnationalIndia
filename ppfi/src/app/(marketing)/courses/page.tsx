import type { Metadata } from "next";

import { SectionHeading } from "@/components/marketing/section-heading";
import { CoursesGrid } from "@/features/content/components/courses-grid";
import { getCourseCategories, getCourses } from "@/features/content";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Browse practical, project-based courses in film, video, marketing, design and more — taught by working industry professionals.",
};

export default function CoursesPage() {
  const courses = getCourses();
  const categories = getCourseCategories();

  return (
    <div className="container py-20">
      <SectionHeading
        eyebrow="Courses"
        title="Practical courses that build real portfolios"
        description="Every track is hands-on and project-based. Filter by discipline to find your path."
      />
      <div className="mt-14">
        <CoursesGrid courses={courses} categories={categories} />
      </div>
    </div>
  );
}
