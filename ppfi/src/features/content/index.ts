import { COURSES } from "./courses";
import { BLOG_POSTS, MENTORS, STUDENT_PROJECTS, SUCCESS_STORIES } from "./data";
import type { BlogPost, Course, Mentor, StudentProject, SuccessStory } from "./types";

/**
 * Content repository — DB-first with automatic seed fallback.
 *
 * Public pages depend only on these accessors. When the MongoDB catalogue is
 * populated (via Admin CRUD or the seed script) it is the source of truth;
 * when it is empty or unreachable (e.g. local dev without a DB, or before
 * seeding) the curated seed arrays are served instead. This keeps the site
 * rendering in every environment while making content fully admin-editable.
 */

async function loadCoursesFromDb(): Promise<Course[] | null> {
  try {
    const { connectToDatabase } = await import("@/server/db/mongoose");
    const { CourseModel } = await import("@/server/db/models/Course");
    await connectToDatabase();
    const docs = await CourseModel.find({ published: true }).lean();
    if (docs.length === 0) return null;
    return docs.map((d) => ({
      slug: d.slug,
      title: d.title,
      category: d.category as Course["category"],
      level: d.level as Course["level"],
      excerpt: d.excerpt,
      description: d.description,
      durationWeeks: d.durationWeeks,
      price: d.price,
      syllabus: d.syllabus,
      outcomes: d.outcomes,
      image: d.image,
      featured: d.featured,
      comingSoon: d.comingSoon,
    }));
  } catch {
    return null;
  }
}

export async function getCourses(): Promise<Course[]> {
  const db = await loadCoursesFromDb();
  const all = db ?? COURSES;
  return all.filter((c) => !c.comingSoon).concat(all.filter((c) => c.comingSoon));
}

export async function getFeaturedCourses(): Promise<Course[]> {
  const all = (await loadCoursesFromDb()) ?? COURSES;
  return all.filter((c) => c.featured);
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const all = (await loadCoursesFromDb()) ?? COURSES;
  return all.find((c) => c.slug === slug);
}

export async function getCourseCategories(): Promise<string[]> {
  const all = (await loadCoursesFromDb()) ?? COURSES;
  return Array.from(new Set(all.map((c) => c.category)));
}

async function loadMentorsFromDb(): Promise<Mentor[] | null> {
  try {
    const { connectToDatabase } = await import("@/server/db/mongoose");
    const { MentorModel } = await import("@/server/db/models/Mentor");
    await connectToDatabase();
    const docs = await MentorModel.find({ published: true }).lean();
    if (docs.length === 0) return null;
    return docs.map((d) => ({
      slug: d.slug,
      name: d.name,
      role: d.role,
      expertise: d.expertise,
      bio: d.bio,
      image: d.image,
      socials: { linkedin: d.linkedin || undefined, instagram: d.instagram || undefined },
    }));
  } catch {
    return null;
  }
}

export async function getMentors(): Promise<Mentor[]> {
  return (await loadMentorsFromDb()) ?? MENTORS;
}

export async function getMentorBySlug(slug: string): Promise<Mentor | undefined> {
  const all = (await loadMentorsFromDb()) ?? MENTORS;
  return all.find((m) => m.slug === slug);
}

async function loadPostsFromDb(): Promise<BlogPost[] | null> {
  try {
    const { connectToDatabase } = await import("@/server/db/mongoose");
    const { BlogPostModel } = await import("@/server/db/models/BlogPost");
    await connectToDatabase();
    const docs = await BlogPostModel.find({ published: true }).lean();
    if (docs.length === 0) return null;
    return docs.map((d) => ({
      slug: d.slug,
      title: d.title,
      excerpt: d.excerpt,
      content: d.content,
      category: d.category,
      author: d.author,
      image: d.image,
      readingMinutes: d.readingMinutes,
      publishedAt: new Date(d.publishedAt).toISOString(),
    }));
  } catch {
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const all = (await loadPostsFromDb()) ?? BLOG_POSTS;
  return [...all].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const all = (await loadPostsFromDb()) ?? BLOG_POSTS;
  return all.find((p) => p.slug === slug);
}

/** Seed-backed content (unchanged in Phase 5). */
export function getStudentProjects(): StudentProject[] {
  return STUDENT_PROJECTS;
}

export function getSuccessStories(): SuccessStory[] {
  return SUCCESS_STORIES;
}

export * from "./types";
