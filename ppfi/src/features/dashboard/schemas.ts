import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  phone: z
    .string()
    .max(20)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || v.length >= 7, "Enter a valid phone number"),
  image: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
