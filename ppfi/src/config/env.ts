import { z } from "zod";

/**
 * Centralised, type-safe environment access.
 *
 * Server secrets live in `serverEnv` and must never be imported into a Client
 * Component. Public values (safe to ship to the browser) live in `publicEnv`.
 *
 * Validation runs lazily so that tooling (lint, typecheck, build steps that
 * don't touch runtime config) does not crash when secrets are absent.
 */

const serverSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
});

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Pixel Perfect Films Institute"),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
});

type ServerEnv = z.infer<typeof serverSchema>;
type PublicEnv = z.infer<typeof publicSchema>;

let cachedServerEnv: ServerEnv | null = null;

/** Access validated server-only environment variables. Server code only. */
export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv;

  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must not be called on the client.");
  }

  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
    throw new Error(`Invalid server environment variables:\n${issues.join("\n")}`);
  }

  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}

/** Public environment variables, safe for the browser. */
export const publicEnv: PublicEnv = publicSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
});
