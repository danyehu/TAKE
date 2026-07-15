import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sessions, released } from "@/lib/content";
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
    alternates: { canonical: `/he/sessions/${s.slug}`, languages: { en: `/sessions/${s.slug}`, he: `/he/sessions/${s.slug}` } },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = sessions.find((x) => x.slug === slug && x.status === "released");
  if (!s) notFound();
  return <SessionView s={s} lang="he" />;
}
