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
export type BtsItem = { src: string; size?: "s" | "m" | "l" };
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
