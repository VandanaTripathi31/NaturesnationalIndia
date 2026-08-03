import { Award, BookOpen, LayoutDashboard, TrendingUp, UserRound } from "lucide-react";

export const dashboardNav = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Courses", href: "/dashboard/courses", icon: BookOpen },
  { title: "Progress", href: "/dashboard/progress", icon: TrendingUp },
  { title: "Certificates", href: "/dashboard/certificates", icon: Award },
  { title: "Profile", href: "/dashboard/profile", icon: UserRound },
] as const;
