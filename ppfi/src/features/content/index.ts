import { COURSES } from "./courses";
import { BLOG_POSTS, MENTORS, STUDENT_PROJECTS, SUCCESS_STORIES } from "./data";
import type { BlogPost, Course, Mentor, StudentProject, SuccessStory } from "./types";

/**
 * Content repository.
 *
 * Public pages depend only on these accessors — never on the raw arrays — so
 * Phase 5 can swap the backing store to MongoDB without changing any page.
 */

export function getCourses(): Course[] {
  return COURSES.filter((c) => !c.comingSoon).concat(COURSES.filter((c) => c.comingSoon));
}

export function getFeaturedCourses(): Course[] {
  return COURSES.filter((c) => c.featured);
}

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getCourseCategories(): string[] {
  return Array.from(new Set(COURSES.map((c) => c.category)));
}

export function getMentors(): Mentor[] {
  return MENTORS;
}

export function getMentorBySlug(slug: string): Mentor | undefined {
  return MENTORS.find((m) => m.slug === slug);
}

export function getStudentProjects(): StudentProject[] {
  return STUDENT_PROJECTS;
}

export function getSuccessStories(): SuccessStory[] {
  return SUCCESS_STORIES;
}

export function getBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export * from "./types";
