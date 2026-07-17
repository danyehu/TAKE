"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* Three diamonds — the TAKE mark */
export function Diamonds({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 132 44" className={className} fill="none" aria-hidden>
      {[22, 66, 110].map((cx) => (
        <g key={cx}>
          <path
            d={`M ${cx} 4 C ${cx + 6} 14, ${cx + 12} 18, ${cx + 18} 22 C ${cx + 12} 26, ${cx + 6} 30, ${cx} 40 C ${cx - 6} 30, ${cx - 12} 26, ${cx - 18} 22 C ${cx - 12} 18, ${cx - 6} 14, ${cx} 4 Z`}
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <ellipse cx={cx} cy="22" rx="3.4" ry="2.2" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

/* Reveal on scroll */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add("in"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`fade-up ${className}`}>
      {children}
    </div>
  );
}

/* YouTube: poster image -> click -> inline player */
export function YouTube({
  id,
  title,
  playLabel = "Play",
}: {
  id: string;
  title: string;
  playLabel?: string;
}) {
  const [playing, setPlaying] = useState(false);
  if (!id) return null;
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full cursor-pointer"
          aria-label={`${playLabel}: ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt={title}
            className="h-full w-full object-cover opacity-80 transition-[transform,opacity] duration-500 ease-out group-hover:scale-[1.02] group-hover:opacity-100"
          />
          <span className="absolute inset-0 vignette" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--line)] bg-black/40 backdrop-blur-sm transition-[transform,background-color] duration-200 ease-out group-hover:scale-105 group-hover:bg-black/60 group-active:scale-95">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-[var(--ink)]">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

/* תפריט מובייל — המבורגר עם שכבת ניווט מלאה */
export function MobileMenu({
  links,
  switchHref,
  switchLabel,
}: {
  links: { href: string; label: string }[];
  switchHref: string;
  switchLabel: string;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <div className="sm:hidden">
      <button
        aria-label="Menu"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
      >
        <span className={`h-px w-5 bg-[var(--ink)] transition-transform duration-200 ease-out ${open ? "translate-y-[6px] rotate-45" : ""}`} />
        <span className={`h-px w-5 bg-[var(--ink)] transition-opacity duration-200 ease-out ${open ? "opacity-0" : ""}`} />
        <span className={`h-px w-5 bg-[var(--ink)] transition-transform duration-200 ease-out ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div className="menu-overlay fixed inset-0 z-[90] flex flex-col items-center justify-center gap-8 bg-[#0b0b0c]/[0.98]">
          <span className="menu-item" style={{ animationDelay: "40ms" }}><Diamonds className="h-6 w-auto text-[var(--muted)]" /></span>
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="menu-item display text-3xl tracking-wide"
              style={{ animationDelay: `${90 + i * 50}ms` }}
            >
              {l.label}
            </a>
          ))}
          <a
            href={switchHref}
            className="menu-item mt-4 border border-[var(--line)] px-6 py-2.5 text-[0.72rem] uppercase tracking-[0.22em] text-[var(--muted)]"
            style={{ animationDelay: `${90 + links.length * 50}ms` }}
          >
            {switchLabel}
          </a>
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute top-4 flex h-10 w-10 items-center justify-center text-2xl text-[var(--muted)] ltr:right-5 rtl:left-5"
          >
            ✕
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}

/* גלילה חלקה ואיטית לעוגנים פנימיים (#sessions וכו') */
export function SmoothScroll() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;
      const path = href.slice(0, hashIndex).replace(/\/$/, "");
      const current = location.pathname.replace(/\/$/, "");
      if (path && path !== current) return; // ניווט לעמוד אחר — לא מתערבים
      const el = document.querySelector(href.slice(hashIndex));
      if (!el) return;
      e.preventDefault();
      const startY = window.scrollY;
      const targetY = el.getBoundingClientRect().top + startY - 72;
      const dist = targetY - startY;
      const dur = Math.min(850, Math.max(450, Math.abs(dist) * 0.35));
      const t0 = performance.now();
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      function step(now: number) {
        const p = Math.min(1, (now - t0) / dur);
        window.scrollTo({ top: startY + dist * ease(p), behavior: "instant" as ScrollBehavior });
        if (p < 1) requestAnimationFrame(step);
        else history.pushState(null, "", href.slice(hashIndex));
      }
      requestAnimationFrame(step);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

/* טופס יצירת קשר — שולח למייל דרך FormSubmit, בלי לפתוח אפליקציית מייל */
export function ContactForm({
  email,
  labels,
}: {
  email: string;
  labels: {
    name: string;
    email: string;
    message: string;
    send: string;
    sent: string;
    error: string;
    topic?: string;
    topicGeneral?: string;
    topicArtist?: string;
    topicPress?: string;
  };
}) {
  const [state, setState] = useState<"idle" | "busy" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("busy");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          ...data,
          _subject: `פנייה מהאתר [${String(data.topic ?? "")}]: ${String(data.name ?? "")}`,
          _replyto: String(data.email ?? ""),
          _template: "table",
        }),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  const inp =
    "w-full border hairline bg-white/[0.03] px-4 py-3.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--ink)]/60";

  if (state === "sent") {
    return (
      <div className="mx-auto mt-10 max-w-md border hairline px-6 py-8">
        <Diamonds className="mx-auto h-5 w-auto text-[var(--muted)]" />
        <p className="mt-4 text-[var(--muted)]">{labels.sent}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-10 flex max-w-md flex-col gap-3 text-start">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder={labels.name} className={inp} />
        <input name="email" type="email" required placeholder={labels.email} className={inp} />
      </div>
      <select name="topic" required defaultValue={labels.topicGeneral} className={`${inp} appearance-none`}>
        <option value={labels.topicGeneral}>{labels.topicGeneral}</option>
        <option value={labels.topicArtist}>{labels.topicArtist}</option>
        <option value={labels.topicPress}>{labels.topicPress}</option>
      </select>
      <textarea name="message" required placeholder={labels.message} className={`${inp} min-h-32`} />
      <button type="submit" disabled={state === "busy"} className="btn btn-primary self-center disabled:opacity-50">
        {state === "busy" ? "..." : labels.send}
      </button>
      {state === "error" && <p className="text-center text-sm text-red-400">{labels.error}</p>}
    </form>
  );
}

/* אינטרו מותגי — הלוגו המונפש מעל האתר, מסתיים בזום פנימה שחושף את הדף */
export function Intro() {
  const [phase, setPhase] = useState<"show" | "zoom" | "gone">("show");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("take-intro");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setPhase("gone");
      return;
    }
    sessionStorage.setItem("take-intro", "1");
    videoRef.current?.play().catch(() => setPhase("zoom"));
    const safety = setTimeout(() => setPhase("zoom"), 3600);
    return () => clearTimeout(safety);
  }, []);

  useEffect(() => {
    if (phase === "zoom") {
      const t = setTimeout(() => setPhase("gone"), 800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === "gone") return null;
  const zooming = phase === "zoom";

  return (
    <div aria-hidden className="fixed inset-0 z-[999] overflow-hidden">
      {/* עמעום עדין של האתר שמאחור — נעלם עם הזום */}
      <div
        className={`absolute inset-0 bg-[#0b0b0c]/80 backdrop-blur-[3px] transition-opacity duration-700 ease-out ${
          zooming ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* הלוגו המונפש — שחור הופך שקוף דרך מיזוג screen */}
      <video
        ref={videoRef}
        src="/intro.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={() => setPhase("zoom")}
        className={`absolute inset-0 h-full w-full object-cover mix-blend-screen transition-[transform,opacity,filter] duration-[800ms] [transition-timing-function:cubic-bezier(0.77,0,0.175,1)] ${
          zooming ? "scale-[2.4] opacity-0 blur-sm" : "scale-100 opacity-100 blur-0"
        }`}
      />
    </div>
  );
}
