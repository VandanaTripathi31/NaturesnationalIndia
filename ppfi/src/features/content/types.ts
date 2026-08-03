/** Shared content types for the public marketing site. */

export type CourseCategory =
  | "Marketing"
  | "Video"
  | "Design"
  | "Photography"
  | "AI"
  | "Development"
  | "Film";

export type CourseLevel = "Beginner" | "Intermediate" | "All Levels";

export interface Course {
  slug: string;
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  /** Short one-line summary for cards. */
  excerpt: string;
  description: string;
  durationWeeks: number;
  /** Price in whole Indian Rupees. */
  price: number;
  syllabus: string[];
  outcomes: string[];
  image: string;
  featured?: boolean;
  comingSoon?: boolean;
}

export interface Mentor {
  slug: string;
  name: string;
  role: string;
  expertise: string[];
  bio: string;
  image: string;
  socials?: { linkedin?: string; instagram?: string };
}

export interface StudentProject {
  slug: string;
  title: string;
  studentName: string;
  course: string;
  image: string;
  description: string;
}

export interface SuccessStory {
  slug: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  course: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readingMinutes: number;
  image: string;
}
