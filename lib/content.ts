import data from "./content.json";

export type Session = {
  slug: string;
  status: "released" | "coming-soon";
  artistEn: string;
  artistHe: string;
  titleEn: string;
  titleHe: string;
  date?: string;
  youtubeId?: string;
  smartlink?: string;
  appleMusic?: string;
  spotify?: string;
  songs?: string[];
  descriptionEn?: string;
  descriptionHe?: string;
};

export const sessions = data.sessions as Session[];
export const released = sessions.filter((s) => s.status === "released");
export const upcoming = sessions.filter((s) => s.status === "coming-soon");
export const latest = released[0];
export const links = data.links;
export const youtubeChannelId = data.youtubeChannelId;
export type BtsItem = { src: string; size?: "s" | "m" | "l"; ratio?: number };

/** תאי המונטאז': עמודות ושורות (רשת 12) לפי הפורמט המקורי + הגודל שנבחר */
export function btsSpan(b: BtsItem): { c: number; r: number } {
  const ratio = b.ratio ?? 1.5;
  const size = b.size ?? "m";
  const portrait = ratio < 0.9;
  if (portrait) {
    if (size === "s") return { c: 3, r: 5 };
    if (size === "l") return { c: 6, r: 9 };
    return { c: 4, r: 6 };
  }
  if (size === "s") return { c: 4, r: 3 };
  if (size === "l") return { c: 8, r: 6 };
  return { c: 6, r: 4 };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const bts: BtsItem[] = ((data as any).bts ?? []).map((x: unknown) =>
  typeof x === "string" ? { src: x, size: "m" } : (x as BtsItem)
);

/** Accepts a plain video ID or any YouTube URL and returns the ID. */
export function ytId(v?: string): string {
  if (!v) return "";
  const m = v.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : v;
}

export type Btn = { labelEn: string; labelHe: string; url: string; style?: "primary" | "ghost" };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buttons: Record<string, Btn[]> = (data as any).buttons ?? {};

/** ממיר יעדי כפתור מיוחדים (@latest, @email, @youtube...) לכתובת אמיתית */
export function resolveBtnUrl(url: string, latestVideoId?: string): string {
  if (url === "@latest") return `https://www.youtube.com/watch?v=${latestVideoId ?? ""}`;
  if (url === "@email") return `mailto:${links.email}?subject=TAKE`;
  if (url.startsWith("@")) {
    const key = url.slice(1) as keyof typeof links;
    return (links[key] as string) || "#";
  }
  return url;
}
