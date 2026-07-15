import data from "./content.json";

export type Lang = "en" | "he";

const meta = {
  en: { dir: "ltr", switchLabel: "עברית", switchHref: "/he" },
  he: { dir: "rtl", switchLabel: "English", switchHref: "/" },
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const texts = data.texts as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dict: any = {
  en: { ...texts.en, ...meta.en },
  he: { ...texts.he, ...meta.he },
};
