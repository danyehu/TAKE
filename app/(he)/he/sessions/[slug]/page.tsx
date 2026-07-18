import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sessions, released, ytId } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { SessionView } from "@/components/site";

export function generateStaticParams() {
  return released.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = sessions.find((x) => x.slug === slug && x.status === "released");
  if (!s) return {};
  return {
    title: `${s.artistHe} — ${s.titleHe}`,
    description: s.descriptionHe,
    alternates: { canonical: `/he/sessions/${s.slug}`, languages: { en: `/sessions/${s.slug}`, he: `/he/sessions/${s.slug}`, "x-default": `/sessions/${s.slug}` } },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = sessions.find((x) => x.slug === slug && x.status === "released");
  if (!s) notFound();
  const vid = ytId(s.youtubeId);
  const jsonLd = vid
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: `${s.artistHe} — ${s.titleHe} (טייק לייב סשן | TAKE Live Session)`,
        description: s.descriptionHe,
        thumbnailUrl: `https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`,
        uploadDate: s.date,
        embedUrl: `https://www.youtube-nocookie.com/embed/${vid}`,
        url: `${SITE_URL}/he/sessions/${s.slug}`,
        inLanguage: "he",
      }
    : null;
  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <SessionView s={s} lang="he" />
    </>
  );
}
