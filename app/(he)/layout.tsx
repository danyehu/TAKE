import type { Metadata } from "next";
import "../globals.css";
import { Nav, Footer } from "@/components/site";
import { SmoothScroll, Track } from "@/components/ui";
import { links } from "@/lib/content";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "טייק TAKE — לייב סשנים מירושלים", template: "%s · טייק TAKE" },
  description:
    "טייק (TAKE) — לייב סשנים אינטימיים וקולנועיים, מצולמים במפעל בירושלים. עיבודים מיוחדים, מוזיקה חיה, רגעים אמיתיים. טייק אחד.",
  keywords: [
    "טייק", "טייק לייב סשן", "לייב סשן", "לייב סשנים", "TAKE",
    "TAKE live sessions", "מוזיקה חיה", "מוזיקה חיה ירושלים", "המפעל ירושלים",
    "הופעות אינטימיות", "אמנים ישראלים", "live session",
  ],
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon-32.png", sizes: "32x32" }, { url: "/icon-192.png", sizes: "192x192" }],
    apple: "/apple-touch-icon.png",
  },
  twitter: { card: "summary_large_image", images: [`${SITE_URL}/og.jpg`] },
  alternates: { canonical: "/he", languages: { en: "/", he: "/he", "x-default": "/" } },
  openGraph: {
    title: "טֵיְיק — לייב סשנים אינטימיים מירושלים",
    description: "ביצועים חיים. רגעים אמיתיים. טֵיְיק אחד.",
    url: `${SITE_URL}/he`,
    siteName: "TAKE",
    type: "website",
    images: [
      { url: `${SITE_URL}/og-square.jpg`, width: 1200, height: 1200 },
      { url: `${SITE_URL}/og.jpg`, width: 1200, height: 630 },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500&family=Frank+Ruhl+Libre:wght@400;500;700&family=Heebo:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={"grain font-[family-name:var(--font-sans-he)]"}>
        <SmoothScroll />
        <Track url={(links as Record<string, string>).audienceForm} />
        <Nav lang="he" />
        {children}
        <Analytics />
        <Footer lang="he" />
      </body>
    </html>
  );
}
