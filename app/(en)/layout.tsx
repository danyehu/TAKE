import type { Metadata } from "next";
import "../globals.css";
import { Nav, Footer } from "@/components/site";
import { SmoothScroll } from "@/components/ui";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "TAKE — Intimate Live Sessions Filmed in Jerusalem", template: "%s · TAKE" },
  description:
    "TAKE is an independent cinematic live-session project filmed at HaMiffal, Jerusalem. Live Sessions. Real Moments. One TAKE.",
  alternates: { canonical: "/", languages: { en: "/", he: "/he" } },
  openGraph: {
    title: "TAKE — Intimate Live Sessions Filmed in Jerusalem",
    description: "Live Sessions. Real Moments. One TAKE.",
    url: SITE_URL,
    siteName: "TAKE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500&family=Frank+Ruhl+Libre:wght@400;500;700&family=Heebo:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={"grain font-[family-name:var(--font-sans)]"}>
        <SmoothScroll />
        <Nav lang="en" />
        {children}
        <Footer lang="en" />
      </body>
    </html>
  );
}
