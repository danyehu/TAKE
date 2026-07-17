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
  image?: string;
};

export const sessions = data.sessions as Session[];
export const released = sessions.filter((s) => s.status === "released");
export const upcoming = sessions.filter((s) => s.status === "coming-soon");
export const latest = released[0];
export const links = data.links;
export const youtubeChannelId = data.youtubeChannelId;
export type BtsItem = { src: string; ratio?: number; x?: number; y?: number; w?: number };

export const BTS_CANVAS = { w: 100, h: 50 }; // יחידות הקנבס של הקולאז'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const bts: BtsItem[] = ((data as any).bts ?? []).map((x: unknown, i: number) => {
  const b = (typeof x === "string" ? { src: x } : x) as BtsItem;
  return {
    ratio: 1.5,
    x: b.x ?? (i % 3) * 33 + 2,
    y: b.y ?? Math.floor(i / 3) * 25 + 2,
    w: b.w ?? 22,
    ...b,
  };
});

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
  if (url === "@latestPage") return `/sessions/${released[0]?.slug ?? ""}`;
  if (url === "@email") return `mailto:${links.email}?subject=TAKE`;
  if (url.startsWith("@")) {
    const key = url.slice(1) as keyof typeof links;
    return (links[key] as string) || "#";
  }
  return url;
}
