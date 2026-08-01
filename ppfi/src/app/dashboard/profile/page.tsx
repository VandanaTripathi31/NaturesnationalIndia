import type { Metadata } from "next";

import { PageHeader } from "@/components/dashboard/page-header";
import { getCurrentUser } from "@/lib/auth/session";
import { ProfileForm } from "@/features/dashboard/components/profile-form";
import { getStudentProfile } from "@/features/dashboard/data";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const profile = await getStudentProfile(user!.id);

  return (
    <div>
      <PageHeader title="Profile" description="Manage your personal details." />
      <ProfileForm
        email={profile?.email ?? user!.email ?? ""}
        initial={{
          name: profile?.name ?? user!.name ?? "",
          phone: profile?.phone ?? "",
          image: profile?.image ?? "",
        }}
      />
    </div>
  );
}
