"use client";

import { useState } from "react";

/* ------------------------------------------------------------------
   TAKE Studio — מסך ניהול תוכן
   מוגן בסיסמה (ADMIN_PASSWORD). שמירה מבצעת commit לגיטהאב,
   ו-Vercel מפרסם את האתר המעודכן אוטומטית תוך כדקה.
------------------------------------------------------------------- */

type Json = Record<string, unknown>;

const FIELD_LABELS: Record<string, string> = {
  youtube: "ערוץ יוטיוב",
  instagram: "אינסטגרם",
  appleArtist: "עמוד אמן באפל מיוזיק",
  spotifyArtist: "עמוד אמן בספוטיפיי",
  email: "אימייל ליצירת קשר",
  youtubeChannelId: "מזהה ערוץ יוטיוב (לסרטון האחרון)",
  slug: "כתובת העמוד (באנגלית, ללא רווחים)",
  status: "סטטוס (released / coming-soon)",
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

function label(key: string) {
  return FIELD_LABELS[key] ?? key;
}

function Field({
  k,
  value,
  onChange,
}: {
  k: string;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (Array.isArray(value) && value.every((x) => typeof x === "string")) {
    return (
      <label className="block">
        <span className="lbl">{label(k)}</span>
        <input
          className="inp"
          value={(value as string[]).join(", ")}
          onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
        />
      </label>
    );
  }
  if (typeof value === "string") {
    const long = value.length > 80 || k.startsWith("description");
    return (
      <label className="block">
        <span className="lbl">{label(k)}</span>
        {long ? (
          <textarea className="inp min-h-24" value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input
            className="inp"
            dir={/He$|^artistHe|^titleHe/.test(k) ? "rtl" : "ltr"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </label>
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

  async function load() {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin", { headers: { "x-admin-password": password } });
    setBusy(false);
    if (!res.ok) {
      setMsg(res.status === 401 ? "סיסמה שגויה" : "שגיאה בטעינה — בדוק שהמשתנים מוגדרים בורסל");
      return;
    }
    const data = await res.json();
    setContent(data.content);
  }

  async function save() {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "x-admin-password": password, "content-type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setBusy(false);
    setMsg(res.ok ? "נשמר! האתר יתעדכן תוך כדקה." : "שגיאה בשמירה: " + (await res.text()));
  }

  if (!content) {
    return (
      <main dir="rtl" className="studio mx-auto flex min-h-svh max-w-sm flex-col justify-center gap-4 px-6">
        <h1 className="text-2xl font-bold">TAKE Studio</h1>
        <p className="text-sm opacity-60">מסך ניהול התוכן של האתר</p>
        <input
          className="inp"
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <button className="btn2" onClick={load} disabled={busy || !password}>
          {busy ? "..." : "כניסה"}
        </button>
        {msg && <p className="text-sm text-red-400">{msg}</p>}
        <style jsx global>{studioCss}</style>
      </main>
    );
  }

  const links = content.links as Json;
  const sessions = content.sessions as Json[];

  return (
    <main dir="rtl" className="studio mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">TAKE Studio</h1>
          <p className="text-sm opacity-60">עריכה → שמירה → האתר מתעדכן לבד תוך כדקה</p>
        </div>
        <button className="btn2" onClick={save} disabled={busy}>
          {busy ? "שומר..." : "שמור ופרסם"}
        </button>
      </div>
      {msg && <p className="mb-6 rounded-lg border border-current px-4 py-3 text-sm">{msg}</p>}

      <h2 className="sect">קישורים כלליים</h2>
      <div className="card">
        {Object.entries(links).map(([k, v]) => (
          <Field key={k} k={k} value={v} onChange={(nv) => setContent({ ...content, links: { ...links, [k]: nv } })} />
        ))}
        <Field
          k="youtubeChannelId"
          value={content.youtubeChannelId}
          onChange={(nv) => setContent({ ...content, youtubeChannelId: nv })}
        />
      </div>

      <h2 className="sect">סשנים</h2>
      {sessions.map((s, i) => (
        <div className="card" key={i}>
          <div className="mb-2 flex items-center justify-between">
            <strong>{(s.artistHe as string) || (s.artistEn as string) || `סשן ${i + 1}`}</strong>
            <button
              className="text-sm text-red-400 hover:underline"
              onClick={() => {
                if (confirm("למחוק את הסשן הזה?"))
                  setContent({ ...content, sessions: sessions.filter((_, j) => j !== i) });
              }}
            >
              מחיקה
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
      <button
        className="btn2"
        onClick={() => setContent({ ...content, sessions: [{ ...EMPTY_SESSION }, ...sessions] })}
      >
        + סשן חדש
      </button>

      <style jsx global>{studioCss}</style>
    </main>
  );
}

const studioCss = `
  .studio { font-family: system-ui, sans-serif; }
  .studio .lbl { display: block; font-size: 0.75rem; opacity: 0.6; margin: 0.8rem 0 0.25rem; }
  .studio .inp { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); border-radius: 0.5rem; padding: 0.55rem 0.8rem; font-size: 0.9rem; color: inherit; }
  .studio .inp:focus { outline: none; border-color: rgba(255,255,255,0.5); }
  .studio .btn2 { background: #f4f1ea; color: #0b0b0c; border-radius: 9999px; padding: 0.6rem 1.6rem; font-weight: 600; font-size: 0.9rem; }
  .studio .btn2:disabled { opacity: 0.5; }
  .studio .sect { font-size: 0.8rem; letter-spacing: 0.2em; opacity: 0.6; margin: 2.5rem 0 0.75rem; }
  .studio .card { border: 1px solid rgba(255,255,255,0.12); border-radius: 1rem; padding: 1.25rem; margin-bottom: 1rem; background: rgba(255,255,255,0.02); }
`;
