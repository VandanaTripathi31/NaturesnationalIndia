import {
  Award,
  BookOpen,
  Building2,
  FileText,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  Layers,
  Users,
} from "lucide-react";

export const adminNav = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Courses", href: "/admin/courses", icon: BookOpen },
  { title: "Students", href: "/admin/students", icon: Users },
  { title: "Mentors", href: "/admin/mentors", icon: GraduationCap },
  { title: "Batches", href: "/admin/batches", icon: Layers },
  { title: "Organizations", href: "/admin/organizations", icon: Building2 },
  { title: "Inquiries", href: "/admin/inquiries", icon: Inbox },
  { title: "Blog", href: "/admin/blog", icon: FileText },
  { title: "Certificates", href: "/admin/certificates", icon: Award },
] as const;
