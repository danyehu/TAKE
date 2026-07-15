import { released, youtubeChannelId, ytId } from "./content";

export type LatestVideo = { id: string; title: string };

/**
 * Latest video on the TAKE YouTube channel, via the public RSS feed.
 * Revalidated every hour — new sessions appear on the site automatically.
 * Falls back to the newest session in content.json if the feed is unreachable.
 */
export async function getLatestVideo(): Promise<LatestVideo> {
  const fallback = released.find((s) => s.youtubeId);
  const fb: LatestVideo = {
    id: ytId(fallback?.youtubeId),
    title: fallback ? `${fallback.artistEn} — ${fallback.titleEn}` : "",
  };
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeChannelId}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return fb;
    const xml = await res.text();
    const id = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = xml.match(/<entry>[\s\S]*?<title>([^<]+)<\/title>/)?.[1];
    if (!id) return fb;
    return { id, title: title ?? fb.title };
  } catch {
    return fb;
  }
}
