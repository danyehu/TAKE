"use client";

import { useState } from "react";
import { Diamonds } from "@/components/ui";

/* ------------------------------------------------------------------
   TAKE Studio — מסך ניהול תוכן
   שמירה מבצעת עדכון בגיטהאב, והאתר מתפרסם מחדש אוטומטית תוך כדקה.
------------------------------------------------------------------- */

type Json = Record<string, unknown>;

const FIELD_LABELS: Record<string, string> = {
  youtube: "ערוץ יוטיוב",
  instagram: "אינסטגרם",
  appleArtist: "עמוד אמן באפל מיוזיק",
  spotifyArtist: "עמוד אמן בספוטיפיי",
  email: "אימייל ליצירת קשר",
  youtubeChannelId: "מזהה ערוץ יוטיוב (לסרטון האחרון בדף הבית)",
  slug: "כתובת העמוד (אנגלית, ללא רווחים)",
  status: "סטטוס",
  artistEn: "שם האמן — אנגלית",
  artistHe: "שם האמן — עברית",
  titleEn: "כותרת — אנגלית",
  titleHe: "כותרת — עברית",
  date: "תאריך (YYYY-MM-DD)",
  youtubeId: "מזהה סרטון יוטיוב",
  smartlink: "סמארט-לינק",
  appleMusic: "קישור אפל מיוזיק",
  spotify: "קישור ספוטיפיי",
  songs: "שירים (מופרדים בפסיק)",
  descriptionEn: "תיאור — אנגלית",
  descriptionHe: "תיאור — עברית",
};

const inputCls =
  "w-full rounded-lg border border-[var(--line)] bg-white/[0.04] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--ink)]/60 focus:bg-white/[0.07]";
const labelCls = "mb-1.5 mt-4 block text-xs text-[var(--muted)]";
const btnCls =
  "rounded-full bg-[var(--ink)] px-7 py-2.5 text-sm font-medium text-[var(--bg)] transition hover:opacity-85 disabled:opacity-40";
const cardCls =
  "mb-5 rounded-2xl border border-[var(--line)] bg-white/[0.02] p-6";

function Field({
  k,
  value,
  onChange,
}: {
  k: string;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const label = FIELD_LABELS[k] ?? k;
  if (k === "status") {
    return (
      <label className="block">
        <span className={labelCls}>{label}</span>
        <select
          className={inputCls}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="released">פורסם (מוצג באתר עם עמוד מלא)</option>
          <option value="coming-soon">בקרוב (כרטיס טיזר בלבד)</option>
        </select>
      </label>
    );
  }
  if (Array.isArray(value) && value.every((x) => typeof x === "string")) {
    return (
      <label className="block">
        <span className={labelCls}>{label}</span>
        <input
          className={inputCls}
          dir="ltr"
          value={(value as string[]).join(", ")}
          onChange={(e) =>
            onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
          }
        />
      </label>
    );
  }
  if (typeof value === "string") {
    const long = value.length > 90 || k.startsWith("description");
    const rtl = /He$/.test(k) || k === "artistHe" || k === "titleHe";
    return (
      <label className="block">
        <span className={labelCls}>{label}</span>
        {long ? (
          <textarea
            className={`${inputCls} min-h-24`}
            dir={rtl ? "rtl" : "ltr"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            className={inputCls}
            dir={rtl ? "rtl" : "ltr"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </label>
    );
  }
  return null;
}

const SECTION_LABELS: Record<string, string> = {
  nav: "תפריט ניווט",
  hero: "מסך פתיחה (Hero)",
  latest: "תווית ריליס אחרון",
  about: "על הפרויקט",
  format: "הפורמט (4 השלבים)",
  sessions: "כותרות אזור הסשנים",
  space: "המקום",
  artists: "לאמנים",
  contact: "צרו קשר",
  footer: "פוטר",
  bts: "מאחורי הקלעים",
  kicker: "שורת פתיח קטנה",
  tagline: "המשפט הראשי",
  watch: "כפתור צפייה",
  explore: "כפתור לכל הסשנים",
  label: "תווית קטנה",
  title: "כותרת",
  p: "פסקה",
  p1: "פסקה ראשונה",
  p2: "פסקה שנייה",
  cta: "כפתור",
  credit: "שורת קרדיט",
  dist: "שורת הפצה",
  steps: "שלבים",
  t: "כותרת שלב",
  d: "תיאור שלב",
};

function tLabel(k: string) {
  return SECTION_LABELS[k] ?? FIELD_LABELS[k] ?? k;
}


/* תצוגה מקדימה חיה של כל רכיב — מתעדכנת בזמן אמת בזמן ההקלדה */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SectionPreview({ sect, value, rtl }: { sect: string; value: any; rtl: boolean }) {
  const dir = rtl ? "rtl" : "ltr";
  const pillBtn =
    "inline-flex items-center justify-center rounded-full border border-[var(--ink)] bg-[var(--ink)] px-6 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-[var(--bg)]";
  const ghostBtn =
    "inline-flex items-center justify-center rounded-full border border-[var(--line)] px-6 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-[var(--muted)]";

  let inner: React.ReactNode = null;

  if (sect === "nav") {
    inner = (
      <div className="flex flex-wrap items-center gap-6 text-[0.68rem] uppercase tracking-[0.22em] text-[var(--muted)]">
        <span className="display text-base normal-case tracking-[0.18em] text-[var(--ink)]">
          {rtl ? "טֵיְיק" : "TAKE"}
        </span>
        {Object.values(value ?? {}).map((v, i) => (
          <span key={i}>{String(v)}</span>
        ))}
      </div>
    );
  } else if (sect === "hero") {
    inner = (
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-1.5 text-[0.62rem] tracking-[0.14em] text-[var(--muted)]">
          <span className="h-1 w-1 rounded-full bg-[var(--ink)]" />
          {rtl ? "ריליס אחרון — שם הסשן" : "Latest release — session name"}
        </span>
        <p className="label">{value?.kicker}</p>
        <h3 className="display text-3xl leading-tight">{value?.tagline}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <span className={pillBtn}>{value?.watch}</span>
          <span className={ghostBtn}>{value?.explore} ↓</span>
        </div>
      </div>
    );
  } else if (sect === "format") {
    inner = (
      <div>
        <p className="label">{value?.label}</p>
        <h3 className="display mt-2 text-2xl">{value?.title}</h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(value?.steps ?? []).map((st: { t: string; d: string }, i: number) => (
            <div key={i} className="border border-[var(--line)] p-3">
              <p className="label">0{i + 1}</p>
              <p className="display mt-1 text-base">{st?.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{st?.d}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (typeof value === "string") {
    inner = <p className="label">{value}</p>;
  } else {
    // מבנה כללי: תווית, כותרת, פסקאות, כפתורים ושורות קטנות
    const v = value ?? {};
    const buttons = ["cta", "emailCta", "watch", "watchYt", "streamOn"].filter((k) => v[k]);
    const smalls = ["credit", "dist", "back", "songs", "comingSoon", "inProduction", "watch", "listen", "followYt", "followIg", "followAm"].filter(
      (k) => v[k] && !buttons.includes(k)
    );
    inner = (
      <div>
        {v.label && <p className="label">{v.label}</p>}
        {v.title && <h3 className="display mt-2 text-2xl">{v.title}</h3>}
        {v.p && <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">{v.p}</p>}
        {v.p1 && <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">{v.p1}</p>}
        {v.p2 && <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--muted)]">{v.p2}</p>}
        {buttons.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {buttons.map((k) => (
              <span key={k} className={pillBtn}>{v[k]}</span>
            ))}
          </div>
        )}
        {smalls.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {smalls.map((k) => (
              <span key={k} className="rounded-full border border-[var(--line)] px-3 py-1 text-[0.62rem] tracking-[0.14em] text-[var(--muted)]">
                {v[k]}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div dir={dir} className="mb-5 rounded-xl border border-dashed border-[var(--ink)]/25 bg-[var(--bg)] p-6">
      <p className="mb-4 text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]" dir="rtl">
        ● תצוגה מקדימה — ככה זה נראה באתר, מתעדכן בזמן אמת
      </p>
      {inner}
    </div>
  );
}

/* עורך רקורסיבי לכל טקסטי האתר */
function TextsNode({
  value,
  rtl,
  onChange,
}: {
  value: unknown;
  rtl: boolean;
  onChange: (v: unknown) => void;
}) {
  if (typeof value === "string") {
    const long = value.length > 90;
    return long ? (
      <textarea
        className={`${inputCls} min-h-24`}
        dir={rtl ? "rtl" : "ltr"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input
        className={inputCls}
        dir={rtl ? "rtl" : "ltr"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (Array.isArray(value)) {
    return (
      <div className="space-y-4">
        {value.map((item, i) => (
          <div key={i} className="rounded-xl border border-[var(--line)] p-4">
            <TextsNode
              value={item}
              rtl={rtl}
              onChange={(nv) => onChange(value.map((x, j) => (j === i ? nv : x)))}
            />
          </div>
        ))}
      </div>
    );
  }
  if (value && typeof value === "object") {
    return (
      <div>
        {Object.entries(value as Json).map(([k, v]) => (
          <div key={k}>
            <span className={labelCls}>{tLabel(k)}</span>
            <TextsNode
              value={v}
              rtl={rtl}
              onChange={(nv) => onChange({ ...(value as Json), [k]: nv })}
            />
          </div>
        ))}
      </div>
    );
  }
  return null;
}

const EMPTY_SESSION = {
  slug: "",
  status: "released",
  artistEn: "",
  artistHe: "",
  titleEn: "",
  titleHe: "",
  date: "",
  youtubeId: "",
  smartlink: "",
  appleMusic: "",
  spotify: "",
  songs: [],
  descriptionEn: "",
  descriptionHe: "",
};

export default function Studio() {
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<Json | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [saved, setSaved] = useState(false);

  async function login(e?: React.FormEvent) {
    e?.preventDefault();
    const form = e?.target as HTMLFormElement | undefined;
    const pw =
      password ||
      (form ? String(new FormData(form).get("password") ?? "") : "");
    if (!pw) {
      setMsg("הקלד סיסמה");
      return;
    }
    setPassword(pw);
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin", { headers: { "x-admin-password": pw } });
      if (!res.ok) {
        setMsg(res.status === 401 ? "סיסמה שגויה" : "שגיאה בטעינה — נסה שוב או פנה לדן");
        return;
      }
      const data = await res.json();
      setContent(data.content);
    } catch {
      setMsg("שגיאת רשת — בדוק חיבור ונסה שוב");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setMsg("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "x-admin-password": password, "content-type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setSaved(true);
        setMsg("נשמר ופורסם! האתר יתעדכן תוך כדקה.");
      } else {
        setMsg("שגיאה בשמירה — נסה שוב");
      }
    } catch {
      setMsg("שגיאת רשת — השינויים לא נשמרו");
    } finally {
      setBusy(false);
    }
  }

  /* ---------- מסך כניסה ---------- */
  if (!content) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-sm flex-col items-center justify-center gap-6 px-6 text-center">
        <Diamonds className="h-7 w-auto text-[var(--ink)]" />
        <div>
          <h1 className="display text-4xl tracking-wide">TAKE Studio</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">מסך ניהול התוכן של האתר</p>
        </div>
        <form onSubmit={login} className="flex w-full flex-col gap-3">
          <input
            className={`${inputCls} text-center`}
            type="password"
            name="password"
            placeholder="סיסמה"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={btnCls} disabled={busy}>
            {busy ? "רגע..." : "כניסה"}
          </button>
        </form>
        {msg && <p className="text-sm text-red-400">{msg}</p>}
      </main>
    );
  }

  /* ---------- מסך עריכה ---------- */
  const links = content.links as Json;
  const sessions = content.sessions as Json[];

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-32 pt-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Diamonds className="h-5 w-auto text-[var(--ink)]" />
          <div>
            <h1 className="display text-2xl">TAKE Studio</h1>
            <p className="text-xs text-[var(--muted)]">
              עריכה ← שמירה ← האתר מתעדכן לבד תוך כדקה
            </p>
          </div>
        </div>
        <button className={btnCls} onClick={save} disabled={busy}>
          {busy ? "שומר..." : "שמור ופרסם"}
        </button>
      </header>

      {msg && (
        <p
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            saved
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          {msg}
        </p>
      )}

      <h2 className="label mb-3 mt-10">קישורים כלליים</h2>
      <div className={cardCls}>
        {Object.entries(links).map(([k, v]) => (
          <Field
            key={k}
            k={k}
            value={v}
            onChange={(nv) => setContent({ ...content, links: { ...links, [k]: nv } })}
          />
        ))}
        <Field
          k="youtubeChannelId"
          value={content.youtubeChannelId}
          onChange={(nv) => setContent({ ...content, youtubeChannelId: nv })}
        />
      </div>

      <div className="mb-3 mt-12 flex items-center justify-between">
        <h2 className="label">סשנים</h2>
        <button
          className="rounded-full border border-[var(--line)] px-5 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
          onClick={() =>
            setContent({ ...content, sessions: [{ ...EMPTY_SESSION }, ...sessions] })
          }
        >
          + סשן חדש
        </button>
      </div>

      {sessions.map((s, i) => (
        <div className={cardCls} key={i}>
          <div className="mb-1 flex items-center justify-between">
            <strong className="display text-lg">
              {(s.artistHe as string) || (s.artistEn as string) || `סשן חדש`}
            </strong>
            <button
              className="text-xs text-red-400/80 transition hover:text-red-400"
              onClick={() => {
                if (confirm("למחוק את הסשן הזה מהאתר?"))
                  setContent({ ...content, sessions: sessions.filter((_, j) => j !== i) });
              }}
            >
              מחיקת סשן
            </button>
          </div>
          {Object.entries(s).map(([k, v]) => (
            <Field
              key={k}
              k={k}
              value={v}
              onChange={(nv) => {
                const next = sessions.map((x, j) => (j === i ? { ...x, [k]: nv } : x));
                setContent({ ...content, sessions: next });
              }}
            />
          ))}
        </div>
      ))}

      {content.texts ? (
        <>
          <h2 className="label mb-3 mt-14">טקסטים באתר</h2>
          {(["he", "en"] as const).map((lng) => {
            const texts = (content.texts as Json)[lng] as Json;
            return (
              <details key={lng} className={cardCls}>
                <summary className="display cursor-pointer text-lg">
                  {lng === "he" ? "עברית" : "English"}
                </summary>
                <div className="mt-4">
                  {Object.entries(texts).map(([sect, v]) => (
                    <details key={sect} className="mb-3 rounded-xl border border-[var(--line)] p-4">
                      <summary className="cursor-pointer text-sm text-[var(--muted)]">
                        {tLabel(sect)}
                      </summary>
                      <div className="mt-2">
                        <SectionPreview sect={sect} value={v} rtl={lng === "he"} />
                        <TextsNode
                          value={v}
                          rtl={lng === "he"}
                          onChange={(nv) =>
                            setContent({
                              ...content,
                              texts: {
                                ...(content.texts as Json),
                                [lng]: { ...texts, [sect]: nv },
                              },
                            })
                          }
                        />
                      </div>
                    </details>
                  ))}
                </div>
              </details>
            );
          })}
        </>
      ) : null}

      <div className="mt-10 flex justify-end">
        <button className={btnCls} onClick={save} disabled={busy}>
          {busy ? "שומר..." : "שמור ופרסם"}
        </button>
      </div>
    </main>
  );
}
