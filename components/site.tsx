import Link from "next/link";
import { dict, type Lang } from "@/lib/i18n";
import { sessions, links, type Session } from "@/lib/content";
import { getLatestVideo } from "@/lib/latest";
import { Diamonds, Reveal, YouTube } from "@/components/ui";

const hrefFor = (lang: Lang, path: string) =>
  lang === "he" ? `/he${path}` : path || "/";

export function Nav({ lang }: { lang: Lang }) {
  const t = dict[lang];
  return (
    <header className="fixed top-0 z-40 w-full border-b hairline bg-[rgba(11,11,12,0.72)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={hrefFor(lang, "/")} className="flex items-center gap-3">
          <Diamonds className="h-5 w-auto text-[var(--ink)]" />
          <span className="display text-xl tracking-[0.18em]">
            {lang === "he" ? "טֵיְיק" : "TAKE"}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-[0.72rem] uppercase tracking-[0.22em] text-[var(--muted)]">
          <a href={hrefFor(lang, "/") + "#sessions"} className="hidden transition hover:text-[var(--ink)] sm:block">
            {t.nav.sessions}
          </a>
          <a href={hrefFor(lang, "/") + "#about"} className="hidden transition hover:text-[var(--ink)] sm:block">
            {t.nav.about}
          </a>
          <a href={hrefFor(lang, "/") + "#space"} className="hidden transition hover:text-[var(--ink)] md:block">
            {t.nav.space}
          </a>
          <a href={hrefFor(lang, "/") + "#contact"} className="hidden transition hover:text-[var(--ink)] sm:block">
            {t.nav.contact}
          </a>
          <a href={t.switchHref} className="border hairline px-3 py-1.5 transition hover:border-[var(--ink)] hover:text-[var(--ink)]">
            {t.switchLabel}
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer({ lang }: { lang: Lang }) {
  const t = dict[lang];
  return (
    <footer className="border-t hairline">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-14 text-center">
        <Diamonds className="h-6 w-auto text-[var(--muted)]" />
        <p className="display text-lg tracking-wide">{dict[lang].hero.tagline}</p>
        <div className="flex gap-6 text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted)]">
          <a href={links.youtube} target="_blank" rel="noreferrer" className="transition hover:text-[var(--ink)]">{t.contact.followYt}</a>
          <a href={links.instagram} target="_blank" rel="noreferrer" className="transition hover:text-[var(--ink)]">{t.contact.followIg}</a>
          <a href={links.appleArtist} target="_blank" rel="noreferrer" className="transition hover:text-[var(--ink)]">{t.contact.followAm}</a>
          {links.spotifyArtist && (
            <a href={links.spotifyArtist} target="_blank" rel="noreferrer" className="transition hover:text-[var(--ink)]">Spotify</a>
          )}
        </div>
        <div className="space-y-1 text-xs text-[var(--muted)]">
          <p>{t.footer.credit}</p>
          <p>{t.footer.dist}</p>
          <p>© {new Date().getFullYear()} TAKE · Dan Yehuda</p>
        </div>
      </div>
    </footer>
  );
}

function SessionCard({ s, lang }: { s: Session; lang: Lang }) {
  const t = dict[lang];
  const artist = lang === "he" ? s.artistHe : s.artistEn;
  const title = lang === "he" ? s.titleHe : s.titleEn;

  if (s.status === "coming-soon") {
    return (
      <div className="group relative flex aspect-[4/3] flex-col items-center justify-center gap-4 border hairline bg-[var(--bg2)] p-8 text-center">
        <Diamonds className="h-5 w-auto text-[var(--muted)] opacity-60 transition duration-700 group-hover:opacity-100" />
        <p className="label">{t.sessions.comingSoon}</p>
        <p className="display text-2xl">{artist}</p>
        <p className="text-sm text-[var(--muted)]">{title}</p>
      </div>
    );
  }

  return (
    <Link
      href={hrefFor(lang, `/sessions/${s.slug}`)}
      className="group relative block aspect-[4/3] overflow-hidden border hairline bg-[var(--bg2)]"
    >
      {s.youtubeId ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://i.ytimg.com/vi/${s.youtubeId}/hqdefault.jpg`}
          alt={`${artist} — ${title}`}
          className="h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-90"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Diamonds className="h-6 w-auto text-[var(--muted)]" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,11,12,0.92)] via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
        <div>
          <p className="display text-2xl">{artist}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{title}</p>
        </div>
        {s.date && (
          <p className="label">{new Date(s.date).getFullYear()}</p>
        )}
      </div>
    </Link>
  );
}

export async function Home({ lang }: { lang: Lang }) {
  const t = dict[lang];
  const latestVideo = await getLatestVideo();

  return (
    <main>
      {/* HERO */}
      <section className="relative flex min-h-svh items-center justify-center overflow-hidden">
        {latestVideo.id && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://i.ytimg.com/vi/${latestVideo.id}/maxresdefault.jpg`}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-35 blur-[2px]"
          />
        )}
        <div className="absolute inset-0 vignette" />
        <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
          <Reveal>
            <Diamonds className="mx-auto h-8 w-auto text-[var(--ink)]" />
          </Reveal>
          <Reveal delay={100}>
            <a
              href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
              target="_blank"
              rel="noreferrer"
              className="pill"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
              {t.latest} — {latestVideo.title}
            </a>
          </Reveal>
          <Reveal delay={200}>
            <p className="label">{t.hero.kicker}</p>
          </Reveal>
          <Reveal delay={300}>
            <h1 className="display max-w-4xl text-5xl leading-[1.08] sm:text-7xl">
              {t.hero.tagline}
            </h1>
          </Reveal>
          <Reveal delay={500}>
            <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
              <a
                href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                {t.hero.watch}
              </a>
              <a href="#sessions" className="btn btn-ghost">
                {t.hero.explore} ↓
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-3xl px-6 py-28 sm:py-36">
        <Reveal>
          <p className="label">{t.about.label}</p>
          <h2 className="display mt-5 text-3xl sm:text-5xl">{t.about.title}</h2>
          <p className="mt-8 text-lg leading-relaxed text-[var(--muted)]">{t.about.p1}</p>
          <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">{t.about.p2}</p>
        </Reveal>
      </section>

      {/* FORMAT */}
      <section className="border-y hairline bg-[var(--bg2)]">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <Reveal>
            <p className="label">{t.format.label}</p>
            <h2 className="display mt-5 text-3xl sm:text-4xl">{t.format.title}</h2>
          </Reveal>
          <div className="mt-14 grid gap-px border hairline bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {t.format.steps.map((s, i) => (
              <Reveal key={s.t} delay={i * 120} className="bg-[var(--bg2)] p-8">
                <p className="label">0{i + 1}</p>
                <h3 className="display mt-4 text-xl">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SESSIONS */}
      <section id="sessions" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal>
          <p className="label">{t.sessions.label}</p>
          <h2 className="display mt-5 text-3xl sm:text-4xl">{t.sessions.title}</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {sessions.map((s, i) => (
            <Reveal key={s.slug} delay={i * 100}>
              <SessionCard s={s} lang={lang} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* SPACE */}
      <section id="space" className="border-y hairline bg-[var(--bg2)]">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
          <Reveal>
            <p className="label">{t.space.label}</p>
            <h2 className="display mt-5 text-3xl sm:text-5xl">{t.space.title}</h2>
            <p className="mt-8 text-lg leading-relaxed text-[var(--muted)]">{t.space.p1}</p>
            <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">{t.space.p2}</p>
          </Reveal>
        </div>
      </section>

      {/* ARTISTS + CONTACT */}
      <section id="contact" className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <Reveal>
          <Diamonds className="mx-auto h-6 w-auto text-[var(--muted)]" />
          <h2 className="display mt-8 text-3xl sm:text-4xl">{t.artists.title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">{t.artists.p}</p>
          <a href={`mailto:${links.email}?subject=TAKE`} className="btn btn-primary mt-10">
            {t.artists.cta}
          </a>
          <p className="mt-12 text-sm text-[var(--muted)]">{t.contact.p}</p>
        </Reveal>
      </section>
    </main>
  );
}

export function SessionView({ s, lang }: { s: Session; lang: Lang }) {
  const t = dict[lang];
  const artist = lang === "he" ? s.artistHe : s.artistEn;
  const title = lang === "he" ? s.titleHe : s.titleEn;
  const desc = lang === "he" ? s.descriptionHe : s.descriptionEn;

  return (
    <main className="mx-auto max-w-5xl px-6 pt-32 pb-24">
      <Link
        href={hrefFor(lang, "/") + "#sessions"}
        className="label transition hover:text-[var(--ink)]"
      >
        ← {t.sessions.back}
      </Link>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">TAKE — Live Session</p>
          <h1 className="display mt-3 text-4xl sm:text-6xl">{artist}</h1>
          <p className="mt-3 text-xl text-[var(--muted)]">{title}</p>
        </div>
        {s.date && (
          <p className="label">
            {new Date(s.date).toLocaleDateString(lang === "he" ? "he-IL" : "en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      <div className="mt-12 border hairline">
        {s.youtubeId ? (
          <YouTube id={s.youtubeId} title={`${artist} — ${title}`} playLabel={t.sessions.watch} />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-[var(--bg2)]">
            <Diamonds className="h-8 w-auto text-[var(--muted)]" />
          </div>
        )}
      </div>

      <div className="mt-14 grid gap-14 sm:grid-cols-[1.5fr_1fr]">
        <div>
          {desc && <p className="text-lg leading-relaxed text-[var(--muted)]">{desc}</p>}
          <div className="mt-10 flex flex-wrap gap-4">
            {s.youtubeId && (
              <a href={`https://www.youtube.com/watch?v=${s.youtubeId}`} target="_blank" rel="noreferrer" className="btn btn-primary">
                {t.sessions.watchYt}
              </a>
            )}
            {s.smartlink && (
              <a href={s.smartlink} target="_blank" rel="noreferrer" className="btn btn-ghost">
                {t.sessions.streamOn}
              </a>
            )}
            {s.spotify && (
              <a href={s.spotify} target="_blank" rel="noreferrer" className="btn btn-ghost">
                Spotify
              </a>
            )}
            {s.appleMusic && (
              <a href={s.appleMusic} target="_blank" rel="noreferrer" className="btn btn-ghost">
                Apple Music
              </a>
            )}
          </div>
        </div>
        {s.songs && s.songs.length > 0 && (
          <div>
            <p className="label">{t.sessions.songs}</p>
            <ol className="mt-5 space-y-3">
              {s.songs.map((song, i) => (
                <li key={song} className="flex items-baseline gap-4 border-b hairline pb-3">
                  <span className="label">0{i + 1}</span>
                  <span className="display text-lg">{song}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </main>
  );
}
