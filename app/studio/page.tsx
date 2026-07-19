"use client";

import { useEffect, useRef, useState } from "react";
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
  facebook: "עמוד פייסבוק",
  audienceForm: "כתובת רישום קהל (Google Apps Script, ראה הוראות)",
  audience: "פופ-אפ הרשמת קהל",
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
  image: "תמונת רקע לכרטיס ולעמוד (כתובת או נתיב; ריק = תמונה מיוטיוב)",
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


/* עורך קולאז' חופשי, כפוף לגריד, עם קנבס מתרחב */
type CanvasItem = { src: string; ratio?: number; x?: number; y?: number; w?: number; credit?: string; m?: number; mx?: number; my?: number; mw?: number };
const CANVAS_W = 100;
const GRID = 4;

function CollageCanvas({
  items,
  canvasH,
  onChange,
  onCanvasH,
}: {
  items: CanvasItem[];
  canvasH: number;
  onChange: (next: CanvasItem[]) => void;
  onCanvasH: (h: number) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<number | null>(null);
  const drag = useRef<{ mode: "move" | "resize"; i: number; sx: number; sy: number; ox: number; oy: number; ow: number } | null>(null);

  const snap = (v: number) => Math.round(v / GRID) * GRID;

  function unit() {
    const r = boxRef.current!.getBoundingClientRect();
    return r.width / CANVAS_W;
  }

  function down(e: React.PointerEvent, i: number, mode: "move" | "resize") {
    e.preventDefault();
    e.stopPropagation();
    setSel(i);
    const b = items[i];
    drag.current = { mode, i, sx: e.clientX, sy: e.clientY, ox: b.x ?? 0, oy: b.y ?? 0, ow: b.w ?? 20 };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function move(e: PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const u = unit();
    const dx = (e.clientX - d.sx) / u;
    const dy = (e.clientY - d.sy) / u;
    const b = items[d.i];
    const ratio = b.ratio ?? 1.5;
    let next: CanvasItem;
    if (d.mode === "move") {
      const w = b.w ?? 20;
      next = {
        ...b,
        x: snap(Math.min(Math.max(d.ox + dx, 0), CANVAS_W - w)),
        y: Math.max(0, snap(d.oy + dy)),
      };
    } else {
      const w = snap(Math.min(Math.max(d.ow + dx, 8), CANVAS_W));
      next = { ...b, w };
    }
    // הקנבס גדל אוטומטית אם יורדים למטה
    const h = (next.w ?? 20) / ratio;
    if ((next.y ?? 0) + h > canvasH - 2) onCanvasH(Math.ceil(((next.y ?? 0) + h + 4) / GRID) * GRID);
    onChange(items.map((x, j) => (j === d.i ? next : x)));
  }

  function up() {
    drag.current = null;
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  }

  function layer(i: number, dir: 1 | -1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setSel(j);
  }

  /* סידור אקראי: קולאז' שורות נקי, צמוד לגריד, בלי חפיפות */
  function scatter() {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const heights = [24, 32, 28, 20];
    let y = 0;
    let idx = 0;
    let hIdx = Math.floor(Math.random() * heights.length);
    const placed: CanvasItem[] = [];
    while (idx < shuffled.length) {
      const rowH = heights[hIdx % heights.length];
      hIdx++;
      let x = 0;
      const row: CanvasItem[] = [];
      while (idx < shuffled.length) {
        const b = shuffled[idx];
        const ratio = b.ratio ?? 1.5;
        const w = Math.max(GRID * 2, Math.round((rowH * ratio) / GRID) * GRID);
        if (x + w > CANVAS_W && row.length > 0) break;
        row.push({ ...b, x, y, w });
        x += w + GRID;
        idx++;
      }
      // מרווח שווה: פיזור העודף בין התמונות בשורה
      const used = row.reduce((a, r) => a + (r.w ?? 0), 0);
      const slots = row.length + 1;
      const spare = Math.max(0, CANVAS_W - used);
      const gap = Math.floor(spare / slots / GRID) * GRID;
      let cx = gap;
      row.forEach((r) => {
        r.x = cx;
        cx += (r.w ?? 0) + gap + GRID;
      });
      placed.push(...row);
      y += rowH + GRID;
    }
    onCanvasH(Math.max(30, Math.ceil(y / GRID) * GRID));
    onChange(placed);
  }

  const selItem = sel !== null ? items[sel] : null;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
          ● הכל נצמד לגריד · גרירה להזזה · פינה שמאלית-תחתונה לגודל
        </p>
        <button
          className="rounded-full border border-[var(--line)] px-4 py-1.5 text-xs text-[var(--muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
          onClick={scatter}
        >
          🎲 סידור אקראי
        </button>
      </div>
      <div
        ref={boxRef}
        dir="ltr"
        onPointerDown={() => setSel(null)}
        className="relative w-full touch-none overflow-hidden rounded-xl border border-dashed border-[var(--ink)]/25 bg-[var(--bg)]"
        style={{
          aspectRatio: `${CANVAS_W} / ${canvasH}`,
          backgroundImage:
            "linear-gradient(to right, rgba(244,241,234,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,241,234,0.05) 1px, transparent 1px)",
          backgroundSize: `${(GRID / CANVAS_W) * 100}% ${(GRID / canvasH) * 100}%`,
        }}
      >
        {items.map((b, i) => {
          const w = b.w ?? 20;
          const h = w / (b.ratio ?? 1.5);
          return (
            <div
              key={b.src + i}
              onPointerDown={(e) => down(e, i, "move")}
              className={`absolute cursor-grab overflow-hidden border active:cursor-grabbing ${
                sel === i ? "border-[var(--ink)] shadow-[0_0_0_1px_var(--ink)]" : "border-white/10"
              }`}
              style={{
                left: `${b.x}%`,
                top: `${((b.y ?? 0) / canvasH) * 100}%`,
                width: `${w}%`,
                height: `${(h / canvasH) * 100}%`,
                zIndex: i + 1,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.src} alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
              {sel === i && (
                <div
                  onPointerDown={(e) => down(e, i, "resize")}
                  className="absolute bottom-0 left-0 h-5 w-5 cursor-nesw-resize border-t border-r border-[var(--ink)] bg-[var(--bg)]"
                  title="שינוי גודל"
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]" onClick={() => onCanvasH(canvasH + 8)}>
          + מקום למטה
        </button>
        <button className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]" onClick={() => onCanvasH(Math.max(30, canvasH - 8))}>
          − קיצור הקנבס
        </button>
      </div>
      {sel !== null && selItem && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs hover:border-[var(--ink)]" onClick={() => layer(sel, 1)}>שכבה קדימה ↑</button>
          <button className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs hover:border-[var(--ink)]" onClick={() => layer(sel, -1)}>שכבה אחורה ↓</button>
          <input
            className="w-44 rounded-lg border border-[var(--line)] bg-white/[0.04] px-3 py-1.5 text-xs text-[var(--ink)] outline-none focus:border-[var(--ink)]/60"
            placeholder="שם הצלם (יוצג בריחוף)"
            value={selItem.credit ?? ""}
            onChange={(e) => onChange(items.map((x, j) => (j === sel ? { ...x, credit: e.target.value } : x)))}
          />
          <button
            className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-400"
            onClick={() => {
              if (confirm("להסיר את התמונה מהקולאז'?")) {
                onChange(items.filter((_, j) => j !== sel));
                setSel(null);
              }
            }}
          >
            הסרת תמונה ✕
          </button>
        </div>
      )}
    </div>
  );
}


/* דשבורד מעקב: קורא נתונים מהגיליון ומציג ברור */
function AnalyticsPanel({ url }: { url: string }) {
  type Stats = {
    today: number; week: number; month: number; signups: number;
    days: Record<string, number>; paths: Record<string, number>;
    refs: Record<string, number>; device: Record<string, number>;
    lang: Record<string, number>; avgStay: number;
  };
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (!url) { setErr(true); return; }
    fetch(`${url}?stats=1&key=take2026`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setErr(true));
  }, [url]);

  if (err)
    return <p className="text-sm text-[var(--muted)]">אין עדיין חיבור נתונים. ודא שהסקריפט בגיליון עודכן לגרסה עם המעקב.</p>;
  if (!stats) return <p className="text-sm text-[var(--muted)]">טוען נתונים...</p>;

  const dayKeys = Object.keys(stats.days).sort().slice(-14);
  const maxDay = Math.max(1, ...dayKeys.map((k) => stats.days[k]));
  const pathNames: Record<string, string> = {
    "/": "דף הבית (אנגלית)", "/he": "דף הבית (עברית)",
  };
  const topPaths = Object.entries(stats.paths).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const topRefs = Object.entries(stats.refs).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const devTotal = Object.values(stats.device).reduce((a, b) => a + b, 0) || 1;
  const mm = Math.floor(stats.avgStay / 60);
  const ss = Math.round(stats.avgStay % 60);

  const stat = (label: string, value: string | number) => (
    <div className="rounded-xl border border-[var(--line)] p-4 text-center">
      <p className="display text-3xl">{value}</p>
      <p className="mt-1 text-xs text-[var(--muted)]">{label}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stat("צפיות היום", stats.today)}
        {stat("השבוע", stats.week)}
        {stat("החודש", stats.month)}
        {stat("נרשמו לקהל", stats.signups)}
      </div>

      <div>
        <p className="mb-2 text-xs text-[var(--muted)]">צפיות ב-14 הימים האחרונים</p>
        <div className="flex h-24 items-end gap-1" dir="ltr">
          {dayKeys.map((k) => (
            <div key={k} className="group relative flex-1">
              <div
                className="w-full rounded-t bg-[var(--ink)]/70 transition-colors group-hover:bg-[var(--ink)]"
                style={{ height: `${Math.max(4, (stats.days[k] / maxDay) * 90)}px` }}
              />
              <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--bg2)] px-1.5 py-0.5 text-[0.55rem] text-[var(--ink)] opacity-0 group-hover:opacity-100">
                {k.slice(5)} · {stats.days[k]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs text-[var(--muted)]">עמודים נצפים</p>
          {topPaths.map(([p, n]) => (
            <div key={p} className="flex items-center justify-between border-b border-[var(--line)] py-1.5 text-sm">
              <span className="truncate">{pathNames[p] ?? p.replace("/he/sessions/", "סשן: ").replace("/sessions/", "Session: ")}</span>
              <span className="text-[var(--muted)]">{n}</span>
            </div>
          ))}
        </div>
        <div>
          <p className="mb-2 text-xs text-[var(--muted)]">מאיפה הגיעו</p>
          {topRefs.length === 0 && <p className="text-sm text-[var(--muted)]">בעיקר כניסות ישירות בינתיים</p>}
          {topRefs.map(([r, n]) => (
            <div key={r} className="flex items-center justify-between border-b border-[var(--line)] py-1.5 text-sm">
              <span className="truncate" dir="ltr">{r || "ישיר"}</span>
              <span className="text-[var(--muted)]">{n}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 text-sm text-[var(--muted)]">
        <span>📱 נייד: {Math.round(((stats.device["נייד"] ?? 0) / devTotal) * 100)}%</span>
        <span>💻 מחשב: {Math.round(((stats.device["מחשב"] ?? 0) / devTotal) * 100)}%</span>
        <span>⏱ זמן שהייה ממוצע: {mm}:{String(ss).padStart(2, "0")} דק׳</span>
      </div>
    </div>
  );
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
  contactForm: "טופס יצירת קשר",
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
  const fileRef = useRef<HTMLInputElement>(null);

  // כניסה אוטומטית אם כבר התחברת מהמחשב הזה
  useEffect(() => {
    const pw = localStorage.getItem("take-studio-pw");
    if (pw) {
      setPassword(pw);
      (async () => {
        setBusy(true);
        try {
          const res = await fetch("/api/admin", { headers: { "x-admin-password": pw } });
          if (res.ok) setContent((await res.json()).content);
          else localStorage.removeItem("take-studio-pw");
        } finally {
          setBusy(false);
        }
      })();
    }
  }, []);

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
      localStorage.setItem("take-studio-pw", pw);
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
          <input type="text" name="username" autoComplete="username" defaultValue="studio" className="hidden" aria-hidden />
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
  const btsList = ((content.bts as Json[]) ?? []) as CanvasItem[];

  function setBts(next: CanvasItem[]) {
    setContent({ ...content, bts: next });
  }


  async function uploadFile(file: File): Promise<string> {
    // הקטנה חכמה בדפדפן לפני העלאה
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    await new Promise((ok, err) => ((img.onload = ok), (img.onerror = err)));
    const scale = Math.min(1, 1800 / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg", 0.82).split(",")[1];
    const res = await fetch("/api/admin", {
      method: "PUT",
      headers: { "x-admin-password": password, "content-type": "application/json" },
      body: JSON.stringify({ name: file.name.replace(/\.[^.]+$/, "") + ".jpg", dataBase64: base64 }),
    });
    if (!res.ok) throw new Error(await res.text());
    const { path } = await res.json();
    return path as string;
  }

  async function uploadImage(file: File) {
    setBusy(true);
    setMsg("");
    try {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      await new Promise((ok, err) => ((img.onload = ok), (img.onerror = err)));
      const path = await uploadFile(file);
      setBts([...btsList, { src: path, ratio: Math.round((img.width / img.height) * 100) / 100, x: 0, y: 0, w: 24 } as { src: string }]);
      setMsg("התמונה הועלתה! עכשיו לחץ \"שמור ופרסם\" כדי שתופיע באתר.");
      setSaved(true);
    } catch {
      setMsg("שגיאה בהעלאת התמונה");
      setSaved(false);
    } finally {
      setBusy(false);
    }
  }

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
        <div className="flex items-center gap-4">
          <button
            className="text-xs text-[var(--muted)] underline-offset-4 hover:underline"
            onClick={() => { localStorage.removeItem("take-studio-pw"); location.reload(); }}
          >
            התנתקות
          </button>
          <button className={btnCls} onClick={save} disabled={busy}>
            {busy ? "שומר..." : "שמור ופרסם"}
          </button>
        </div>
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
        <details className={cardCls} key={i}>
          <summary className="flex cursor-pointer list-none items-center justify-between">
            <strong className="display text-lg">
              {(s.artistHe as string) || (s.artistEn as string) || `סשן חדש`}
              <span className="mx-3 text-xs font-normal text-[var(--muted)]">
                {s.status === "released" ? "פורסם" : "בקרוב"} · לחץ לעריכה
              </span>
            </strong>
            <button
              className="text-xs text-red-400/80 transition hover:text-red-400"
              onClick={(e) => {
                e.preventDefault();
                if (confirm("למחוק את הסשן הזה מהאתר?"))
                  setContent({ ...content, sessions: sessions.filter((_, j) => j !== i) });
              }}
            >
              מחיקת סשן
            </button>
          </summary>
          {Object.entries(s).map(([k, v]) =>
            k === "image" ? (
              <div key={k}>
                <span className={labelCls}>{FIELD_LABELS.image}</span>
                <div className="flex items-center gap-3">
                  {typeof v === "string" && v ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v} alt="" className="h-14 w-24 rounded-lg border border-[var(--line)] object-cover" />
                  ) : (
                    <span className="flex h-14 w-24 items-center justify-center rounded-lg border border-dashed border-[var(--line)] text-[0.6rem] text-[var(--muted)]">מיוטיוב</span>
                  )}
                  <label className="cursor-pointer rounded-full border border-[var(--line)] px-4 py-2 text-xs text-[var(--muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]">
                    {busy ? "מעלה..." : "העלאת תמונה"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (!f) return;
                        setBusy(true);
                        try {
                          const path = await uploadFile(f);
                          setContent({ ...content, sessions: sessions.map((x, j) => (j === i ? { ...x, image: path } : x)) });
                          setMsg("התמונה הועלתה. לחץ \"שמור ופרסם\" כדי שתופיע.");
                          setSaved(true);
                        } catch {
                          setMsg("שגיאה בהעלאה");
                          setSaved(false);
                        } finally {
                          setBusy(false);
                        }
                      }}
                    />
                  </label>
                  {typeof v === "string" && v && (
                    <button
                      className="text-xs text-red-400/80 hover:text-red-400"
                      onClick={() => setContent({ ...content, sessions: sessions.map((x, j) => (j === i ? { ...x, image: "" } : x)) })}
                    >
                      הסרה (חזרה ליוטיוב)
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <Field
                key={k}
                k={k}
                value={v}
                onChange={(nv) => {
                  const next = sessions.map((x, j) => (j === i ? { ...x, [k]: nv } : x));
                  setContent({ ...content, sessions: next });
                }}
              />
            )
          )}
        </details>
      ))}

      <h2 className="label mb-3 mt-14">מעקב וסטטיסטיקות</h2>
      <div className={cardCls}>
        <AnalyticsPanel url={String((content.links as Json).audienceForm ?? "")} />
        <p className="mt-4 text-[0.6rem] text-[var(--muted)]/60">
          הנתונים נאספים לגיליון של טייק בדרייב · לנתונים טכניים מפורטים יותר:{" "}
          <a className="underline" href="https://vercel.com/take-livesessions/take/analytics" target="_blank" rel="noreferrer">Vercel Analytics</a>
        </p>
      </div>

      <h2 className="label mb-3 mt-14">גלריית מאחורי הקלעים</h2>
      <div className={cardCls}>
        <p className="mb-4 text-xs text-[var(--muted)]">
          קולאז' חופשי — בדיוק כפי שייראה באתר. שינויים נשמרים רק אחרי "שמור ופרסם".
        </p>
        <CollageCanvas
          items={btsList}
          canvasH={Number(content.btsCanvasH ?? 50)}
          onChange={setBts}
          onCanvasH={(h) => setContent({ ...content, bts: btsList, btsCanvasH: h })}
        />
        <details className="mt-5">
          <summary className="cursor-pointer text-xs text-[var(--muted)]">פריסת נייד: עריכה ידנית מלאה (גרירה, גודל, אקראי)</summary>
          <div className="mx-auto mt-3 w-72">
            <CollageCanvas
              items={btsList.map((b) => ({
                ...b,
                x: b.mx ?? ((b.m ?? 0) % 2) * 52,
                y: b.my ?? Math.floor((b.m ?? 0) / 2) * 40,
                w: b.mw ?? 44,
              }))}
              canvasH={Number(content.btsCanvasHM ?? 170)}
              onChange={(next) =>
                setBts(
                  next.map((n, i) => ({
                    ...btsList[i],
                    ...n,
                    x: btsList[i]?.x,
                    y: btsList[i]?.y,
                    w: btsList[i]?.w,
                    mx: n.x,
                    my: n.y,
                    mw: n.w,
                  }))
                )
              }
              onCanvasH={(h) => setContent({ ...content, bts: btsList, btsCanvasHM: h })}
            />
            <p className="mt-2 text-[0.6rem] text-[var(--muted)]/70">
              הפריסה כאן נפרדת מהדסקטופ ותוצג בטלפונים בדיוק כפי שסידרת.
            </p>
          </div>
        </details>

        <div className="mt-4 flex items-center gap-3">
          <button
            className="rounded-full border border-dashed border-[var(--line)] px-5 py-2.5 text-sm text-[var(--muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
          >
            {busy ? "מעלה..." : "+ העלאת תמונה"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }}
          />
        </div>
      </div>

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
