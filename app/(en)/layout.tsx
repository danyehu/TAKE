import type { Metadata } from "next";
import "../globals.css";
import { Nav, Footer } from "@/components/site";
import { Intro, SmoothScroll } from "@/components/ui";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "TAKE — Live Sessions Filmed in Jerusalem | טייק לייב סשנים", template: "%s · TAKE Live Sessions" },
  description:
    "TAKE Live Sessions — intimate, cinematic live music sessions filmed at HaMiffal, Jerusalem. Special arrangements, real moments, one TAKE. טייק — לייב סשנים מירושלים.",
  keywords: [
    "TAKE", "TAKE live sessions", "live session", "live sessions Jerusalem",
    "טייק", "טייק לייב סשן", "לייב סשן", "לייב סשנים", "מוזיקה חיה ירושלים",
    "HaMiffal", "המפעל ירושלים", "live music Israel", "Israeli artists live",
  ],
  alternates: { canonical: "/", languages: { en: "/", he: "/he" } },
  openGraph: {
    title: "TAKE — Intimate Live Sessions Filmed in Jerusalem",
    description: "Live Sessions. Real Moments. One TAKE.",
    url: SITE_URL,
    siteName: "TAKE",
    type: "website",
    images: [{ url: `${SITE_URL}/bts/02.jpg`, width: 1800, height: 1200 }],
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#org`,
      name: "TAKE — Live Sessions",
      alternateName: ["טייק", "TAKE Live Sessions", "טייק לייב סשנים"],
      url: SITE_URL,
      description:
        "Independent cinematic live-session project filmed at HaMiffal, Jerusalem. Founded by Dan Yehuda.",
      founder: { "@type": "Person", name: "Dan Yehuda" },
      location: { "@type": "Place", name: "HaMiffal, Jerusalem" },
      sameAs: [
        "https://www.youtube.com/channel/UCOWfZo548mTzEoVrb399TcQ",
        "https://www.instagram.com/take.live.sessions/",
        "https://music.apple.com/il/artist/take/1847349204",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "TAKE — Live Sessions",
      inLanguage: ["en", "he"],
      publisher: { "@id": `${SITE_URL}#org` },
    },
  ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Intro />
        <SmoothScroll />
        <Nav lang="en" />
        {children}
        <Footer lang="en" />
      </body>
    </html>
  );
}
