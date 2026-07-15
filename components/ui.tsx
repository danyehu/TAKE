"use client";

import { useEffect, useRef, useState } from "react";

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
            className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-100"
          />
          <span className="absolute inset-0 vignette" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--line)] bg-black/40 backdrop-blur-sm transition duration-500 group-hover:bg-black/60 group-hover:scale-110">
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
        <span className={`h-px w-5 bg-[var(--ink)] transition duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`} />
        <span className={`h-px w-5 bg-[var(--ink)] transition duration-300 ${open ? "opacity-0" : ""}`} />
        <span className={`h-px w-5 bg-[var(--ink)] transition duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
      </button>
      {open && (
        <div className="fixed inset-0 top-[57px] z-30 flex flex-col items-center justify-center gap-8 bg-[rgba(11,11,12,0.97)] backdrop-blur-md">
          <Diamonds className="h-6 w-auto text-[var(--muted)]" />
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="display text-3xl tracking-wide"
            >
              {l.label}
            </a>
          ))}
          <a href={switchHref} className="mt-4 border border-[var(--line)] px-6 py-2.5 text-[0.72rem] uppercase tracking-[0.22em] text-[var(--muted)]">
            {switchLabel}
          </a>
        </div>
      )}
    </div>
  );
}
