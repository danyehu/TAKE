// ---------------------------------------------------------------
// TAKE — content file. Edit this file to add sessions & texts.
// Every session is one object. status: "released" | "coming-soon"
// ---------------------------------------------------------------

export type Session = {
  slug: string;
  status: "released" | "coming-soon";
  artistEn: string;
  artistHe: string;
  titleEn: string;
  titleHe: string;
  date?: string; // ISO
  youtubeId?: string; // main video
  smartlink?: string;
  appleMusic?: string;
  spotify?: string;
  songs?: string[];
  descriptionEn?: string;
  descriptionHe?: string;
  credits?: { role: string; name: string }[];
};

export const sessions: Session[] = [
  {
    slug: "folly-tree",
    status: "released",
    artistEn: "Folly Tree",
    artistHe: "פולי טרי",
    titleEn: "Cut The Rope",
    titleHe: "Cut The Rope",
    date: "2026-01-07",
    youtubeId: "", // TODO: add the Cut The Rope YouTube ID
    appleMusic:
      "https://music.apple.com/il/album/cut-the-rope-take-live-session-single/1861512489",
    songs: ["Cut The Rope"],
    descriptionEn:
      "Folly Tree steps into the room with a song stripped to its nerve. A live arrangement made for this session — direct, tender, and unrepeatable.",
    descriptionHe:
      "פולי טרי נכנס לחדר עם שיר שהופשט עד העצב החשוף שלו. עיבוד חי שנוצר במיוחד לסשן — ישיר, עדין, ובלתי ניתן לשחזור.",
  },
  {
    slug: "griffin",
    status: "released",
    artistEn: "Griffin",
    artistHe: "גריפין",
    titleEn: "Honeycomb",
    titleHe: "Honeycomb",
    date: "2025-10-29",
    youtubeId: "CyRbc0DGoVI",
    smartlink: "https://take.lnk.to/Griffin",
    appleMusic:
      "https://music.apple.com/il/album/griffin-take-live-session-single/1847160379",
    songs: ["Honeycomb", "Observation of the Clouds", "Childish Prayer"],
    descriptionEn:
      "The first TAKE. Griffin and his band inside HaMiffal — three songs, specially arranged, captured live in one close, breathing room.",
    descriptionHe:
      "הטייק הראשון. גריפין והלהקה בתוך המפעל — שלושה שירים בעיבודים מיוחדים, מוקלטים חיים בחדר אחד, קרוב ונושם.",
  },
  {
    slug: "session-03",
    status: "coming-soon",
    artistEn: "Session 03",
    artistHe: "סשן 03",
    titleEn: "In production",
    titleHe: "בהפקה",
  },
  {
    slug: "session-04",
    status: "coming-soon",
    artistEn: "Session 04",
    artistHe: "סשן 04",
    titleEn: "In production",
    titleHe: "בהפקה",
  },
];

export const released = sessions.filter((s) => s.status === "released");
export const upcoming = sessions.filter((s) => s.status === "coming-soon");
export const latest = released[0];

export const links = {
  youtube: "https://www.youtube.com/channel/UCOWfZo548mTzEoVrb399TcQ",
  instagram: "https://www.instagram.com/take.live.sessions/",
  appleArtist: "https://music.apple.com/il/artist/take/1847349204",
  email: "danyeuda@gmail.com",
};
