import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Enter a valid email"),
  subject: z.string().max(160).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const inquirySchema = z.object({
  instituteName: z.string().min(2, "Institute name is required").max(160),
  contactPerson: z.string().min(2, "Contact person is required").max(120),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number").max(20),
  studentStrength: z.coerce.number().int().min(1, "Enter expected student strength"),
  interestAreas: z.array(z.string()).default([]),
  timeSlots: z.string().max(240).optional(),
  message: z.string().max(2000).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
