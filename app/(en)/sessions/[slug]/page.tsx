import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sessions, released, ytId } from "@/lib/content";
import { SessionView } from "@/components/site";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return released.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = sessions.find((x) => x.slug === slug && x.status === "released");
  if (!s) return {};
  return {
    title: `${s.artistEn} — ${s.titleEn}`,
    description: s.descriptionEn,
    alternates: { canonical: `/sessions/${s.slug}`, languages: { en: `/sessions/${s.slug}`, he: `/he/sessions/${s.slug}` } },
    openGraph: {
      title: `${s.artistEn} — ${s.titleEn} · TAKE Live Session`,
      description: s.descriptionEn,
      images: s.youtubeId ? [`https://i.ytimg.com/vi/${ytId(s.youtubeId)}/maxresdefault.jpg`] : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = sessions.find((x) => x.slug === slug && x.status === "released");
  if (!s) notFound();

  const jsonLd = s.youtubeId
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: `${s.artistEn} — ${s.titleEn} (TAKE Live Session)`,
        description: s.descriptionEn,
        thumbnailUrl: `https://i.ytimg.com/vi/${ytId(s.youtubeId)}/maxresdefault.jpg`,
        uploadDate: s.date,
        embedUrl: `https://www.youtube-nocookie.com/embed/${ytId(s.youtubeId)}`,
        url: `${SITE_URL}/sessions/${s.slug}`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <SessionView s={s} lang="en" />
    </>
  );
}
