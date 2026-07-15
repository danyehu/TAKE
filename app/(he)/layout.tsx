import type { Metadata } from "next";
import "../globals.css";
import { Nav, Footer } from "@/components/site";
import { SmoothScroll } from "@/components/ui";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "טֵיְיק — לייב סשנים אינטימיים מירושלים", template: "%s · טֵיְיק" },
  description:
    "טֵיְיק הוא פרויקט לייב סשנים מוזיקלי־קולנועי עצמאי, מצולם במפעל בירושלים. ביצועים חיים. רגעים אמיתיים. טֵיְיק אחד.",
  alternates: { canonical: "/he", languages: { en: "/", he: "/he" } },
  openGraph: {
    title: "טֵיְיק — לייב סשנים אינטימיים מירושלים",
    description: "ביצועים חיים. רגעים אמיתיים. טֵיְיק אחד.",
    url: `${SITE_URL}/he`,
    siteName: "TAKE",
    type: "website",
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
        <Nav lang="he" />
        {children}
        <Footer lang="he" />
      </body>
    </html>
  );
}
