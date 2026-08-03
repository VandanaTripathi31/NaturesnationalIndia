import type { FieldConfig } from "@/components/admin/admin-form";

export const courseFields: FieldConfig[] = [
  { name: "slug", label: "Slug", placeholder: "video-editing", help: "Lowercase, dashes only. Used in the URL." },
  { name: "title", label: "Title" },
  { name: "category", label: "Category", placeholder: "Video" },
  { name: "level", label: "Level", placeholder: "All Levels" },
  { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2 },
  { name: "description", label: "Description", type: "textarea" },
  { name: "durationWeeks", label: "Duration (weeks)", type: "number" },
  { name: "price", label: "Price (INR)", type: "number" },
  { name: "image", label: "Image URL", type: "url" },
  { name: "syllabus", label: "Syllabus", type: "tags", help: "One item per line." },
  { name: "outcomes", label: "Outcomes", type: "tags", help: "One item per line." },
  { name: "featured", label: "Featured on homepage", type: "checkbox" },
  { name: "comingSoon", label: "Coming soon", type: "checkbox" },
];

export const mentorFields: FieldConfig[] = [
  { name: "slug", label: "Slug", placeholder: "arjun-mehta" },
  { name: "name", label: "Name" },
  { name: "role", label: "Role" },
  { name: "bio", label: "Bio", type: "textarea" },
  { name: "image", label: "Image URL", type: "url" },
  { name: "expertise", label: "Expertise", type: "tags", help: "One per line." },
  { name: "linkedin", label: "LinkedIn URL", type: "url" },
  { name: "instagram", label: "Instagram URL", type: "url" },
];

export const postFields: FieldConfig[] = [
  { name: "slug", label: "Slug", placeholder: "building-your-first-portfolio" },
  { name: "title", label: "Title" },
  { name: "category", label: "Category" },
  { name: "author", label: "Author" },
  { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2 },
  { name: "content", label: "Content", type: "textarea", rows: 10 },
  { name: "image", label: "Image URL", type: "url" },
  { name: "readingMinutes", label: "Reading time (min)", type: "number" },
];

export function buildBatchFields(
  courseOptions: { value: string; label: string }[],
  orgOptions: { value: string; label: string }[],
  mentorOptions: { value: string; label: string }[],
): FieldConfig[] {
  return [
    { name: "name", label: "Batch name", placeholder: "Videography — Batch A" },
    { name: "courseSlug", label: "Course", type: "select", options: courseOptions },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "b2c", label: "B2C cohort" },
        { value: "b2b", label: "B2B (on-campus)" },
      ],
    },
    {
      name: "organization",
      label: "Organization (B2B only)",
      type: "select",
      options: [{ value: "", label: "— None —" }, ...orgOptions],
    },
    {
      name: "mentorSlug",
      label: "Mentor",
      type: "select",
      options: [{ value: "", label: "— Unassigned —" }, ...mentorOptions],
    },
    { name: "capacity", label: "Capacity", type: "number" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "upcoming", label: "Upcoming" },
        { value: "running", label: "Running" },
        { value: "completed", label: "Completed" },
      ],
    },
  ];
}

export const organizationFields: FieldConfig[] = [
  { name: "name", label: "Institute name" },
  { name: "contactPerson", label: "Contact person" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone" },
  { name: "address", label: "Address", type: "textarea", rows: 2 },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "paused", label: "Paused" },
      { value: "ended", label: "Ended" },
    ],
  },
  { name: "notes", label: "Notes", type: "textarea", rows: 3 },
];
