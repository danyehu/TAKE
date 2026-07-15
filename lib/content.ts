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
