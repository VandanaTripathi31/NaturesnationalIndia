import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser } from "@/lib/auth/session";
import { getStudentEnrollments } from "@/features/dashboard/data";

export const metadata: Metadata = { title: "My Courses" };

export default async function EnrolledCoursesPage() {
  const user = await getCurrentUser();
  const enrollments = await getStudentEnrollments(user!.id);

  return (
    <div>
      <PageHeader title="My Courses" description="All the courses you're enrolled in." />

      {enrollments.length === 0 ? (
        <EmptyState
          title="You haven't enrolled yet"
          description="Explore the catalogue and enrol to get started."
          action={
            <Button asChild>
              <Link href="/courses">Browse courses</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {enrollments.map((e) => (
            <div key={e.id} className="overflow-hidden rounded-xl border bg-card">
              {e.courseImage ? (
                <div className="relative aspect-[16/9]">
                  <Image
                    src={e.courseImage}
                    alt={e.courseTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <Badge variant="muted">{e.courseCategory}</Badge>
                  {e.status === "completed" ? <Badge>Completed</Badge> : null}
                  {e.source === "b2b" ? <Badge variant="secondary">Partner</Badge> : null}
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{e.courseTitle}</h3>
                <div className="mt-4 flex items-center gap-3">
                  <Progress value={e.progress} />
                  <span className="text-sm font-medium">{e.progress}%</span>
                </div>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <Link href={`/courses/${e.courseSlug}`}>Go to course</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
