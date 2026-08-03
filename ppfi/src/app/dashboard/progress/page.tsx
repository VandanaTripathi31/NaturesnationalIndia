import Link from "next/link";
import type { Metadata } from "next";

import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser } from "@/lib/auth/session";
import { getStudentEnrollments } from "@/features/dashboard/data";

export const metadata: Metadata = { title: "Progress" };

export default async function ProgressPage() {
  const user = await getCurrentUser();
  const enrollments = await getStudentEnrollments(user!.id);

  return (
    <div>
      <PageHeader
        title="Progress"
        description="Track how far you've come across every course."
      />

      {enrollments.length === 0 ? (
        <EmptyState
          title="No progress to show yet"
          description="Once you enrol in a course, your progress will appear here."
          action={
            <Button asChild>
              <Link href="/courses">Browse courses</Link>
            </Button>
          }
        />
      ) : (
        <div className="divide-y rounded-xl border bg-card">
          {enrollments.map((e) => (
            <div key={e.id} className="flex items-center gap-4 p-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{e.courseTitle}</p>
                  {e.status === "completed" ? <Badge>Completed</Badge> : null}
                </div>
                <Progress value={e.progress} className="mt-3" />
              </div>
              <span className="w-12 shrink-0 text-right text-sm font-semibold">
                {e.progress}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
