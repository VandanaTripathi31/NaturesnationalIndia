import type { BlogPost, Mentor, StudentProject, SuccessStory } from "./types";

export const MENTORS: Mentor[] = [
  {
    slug: "arjun-mehta",
    name: "Arjun Mehta",
    role: "Founder & Lead Filmmaker",
    expertise: ["Direction", "Cinematography", "Storytelling"],
    bio: "Arjun has directed award-winning ad films and branded content for national clients. He leads the filmmaking track and mentors students on real production sets.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    socials: { linkedin: "#", instagram: "#" },
  },
  {
    slug: "neha-kapoor",
    name: "Neha Kapoor",
    role: "Head of Digital Marketing",
    expertise: ["Performance Marketing", "Brand Strategy", "SEO"],
    bio: "Neha has scaled paid campaigns for D2C brands across Meta and Google. She turns marketing theory into hands-on, campaign-led learning.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
    socials: { linkedin: "#" },
  },
  {
    slug: "rohan-desai",
    name: "Rohan Desai",
    role: "Senior Video Editor & Colourist",
    expertise: ["Editing", "Colour Grading", "Sound Design"],
    bio: "Rohan edits and grades commercial films at Pixel Perfect Films. He teaches editing the way it's practised in a working post-production suite.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    socials: { instagram: "#" },
  },
  {
    slug: "ananya-rao",
    name: "Ananya Rao",
    role: "Photographer & Content Lead",
    expertise: ["Photography", "Content Creation", "Reels"],
    bio: "Ananya shoots for brands and creators, and leads the content-creation track — from idea to published, platform-native content.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    socials: { linkedin: "#", instagram: "#" },
  },
];

export const STUDENT_PROJECTS: StudentProject[] = [
  {
    slug: "monsoon-brand-film",
    title: "Monsoon — Brand Film",
    studentName: "Kabir S.",
    course: "Film Making",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1000&q=80",
    description: "A 60-second brand film shot and directed during the filmmaking capstone.",
  },
  {
    slug: "streetwear-campaign",
    title: "Streetwear Launch Campaign",
    studentName: "Priya N.",
    course: "Digital Marketing",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=80",
    description: "A full-funnel paid campaign for a local streetwear label.",
  },
  {
    slug: "portrait-series",
    title: "City Portraits",
    studentName: "Aditya M.",
    course: "Photography & Cinematography",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000&q=80",
    description: "A portrait series exploring light and character across the city.",
  },
  {
    slug: "cafe-reels",
    title: "Café Reels Series",
    studentName: "Sara K.",
    course: "Content Creation",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&q=80",
    description: "A set of short-form reels that grew a café's following organically.",
  },
  {
    slug: "product-grade",
    title: "Product Ad — Colour Grade",
    studentName: "Vivek R.",
    course: "Video Editing",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1000&q=80",
    description: "A graded product advertisement edited from raw studio footage.",
  },
  {
    slug: "brand-identity",
    title: "Bloom — Brand Identity",
    studentName: "Isha P.",
    course: "Graphic Design",
    image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=1000&q=80",
    description: "A complete brand identity system for a wellness startup.",
  },
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    slug: "kabir-story",
    name: "Kabir Sharma",
    role: "Freelance Filmmaker",
    quote:
      "I came in knowing nothing about a camera. I left with a reel that got me my first paid client within a month.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80",
    course: "Film Making",
  },
  {
    slug: "priya-story",
    name: "Priya Nair",
    role: "Marketing Associate",
    quote:
      "The campaigns weren't hypothetical — I ran real ads with real budgets. That experience is exactly what got me hired.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
    course: "Digital Marketing",
  },
  {
    slug: "aditya-story",
    name: "Aditya Menon",
    role: "Content Creator",
    quote:
      "Learning from people who actually shoot for brands changed everything. My content finally looks professional.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    course: "Content Creation",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-practical-media-education-wins",
    title: "Why Practical Media Education Wins",
    excerpt:
      "Theory has its place — but portfolios get people hired. Here's why we teach through live projects.",
    content:
      "The creative industry doesn't hire certificates; it hires work. At Pixel Perfect Films Institute, every course ends in a real, shareable output because that is what opens doors...",
    category: "Learning",
    author: "Arjun Mehta",
    publishedAt: "2026-06-12",
    readingMinutes: 4,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&q=80",
  },
  {
    slug: "building-your-first-portfolio",
    title: "Building Your First Creative Portfolio",
    excerpt: "A step-by-step approach to assembling work that actually gets you noticed.",
    content:
      "A great portfolio is curated, not exhaustive. Start with three pieces you're proud of, tell the story behind each, and show range without diluting your voice...",
    category: "Career",
    author: "Ananya Rao",
    publishedAt: "2026-05-28",
    readingMinutes: 5,
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1000&q=80",
  },
  {
    slug: "the-editors-workflow",
    title: "Inside a Working Editor's Workflow",
    excerpt: "From ingest to delivery — how professional edits actually come together.",
    content:
      "Speed in editing comes from structure, not shortcuts. Organise your media, build a rough assembly, then refine in passes — picture, sound, colour, delivery...",
    category: "Craft",
    author: "Rohan Desai",
    publishedAt: "2026-05-10",
    readingMinutes: 6,
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&q=80",
  },
];
