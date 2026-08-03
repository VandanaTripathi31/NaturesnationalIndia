import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";

import { AuthSessionProvider } from "@/components/providers/session-provider";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: [
    "film institute",
    "videography course",
    "video editing course",
    "digital marketing course",
    "content creation",
    "Pixel Perfect Films",
  ],
  authors: [{ name: siteConfig.parentCompany }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(fontSans.variable, fontDisplay.variable, "font-sans")}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
