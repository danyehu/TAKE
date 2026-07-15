# TAKE — טֵיְיק · Website

Intimate live sessions filmed in Jerusalem. **Live Sessions. Real Moments. One TAKE.**

Built with Next.js 15 + Tailwind CSS. English (`/`) and Hebrew RTL (`/he`).

## Editing content — one file

All sessions, links and texts live in two files:

- **`lib/content.ts`** — sessions catalogue. Add a session = add one object.
  - `status: "released"` → full page + video embed
  - `status: "coming-soon"` → teaser card
  - Add the YouTube ID of Cut The Rope in the `folly-tree` entry (`youtubeId`).
- **`lib/i18n.ts`** — all site texts, EN + HE.

## Local dev

```bash
npm install
npm run dev
```

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. vercel.com → Add New Project → import the repo → Deploy (zero config).
3. Project Settings → Domains → add `take-livesessions.com` and follow the DNS instructions at your registrar (A record `76.76.21.21` or CNAME `cname.vercel-dns.com`).

Environment variable (optional): `NEXT_PUBLIC_SITE_URL=https://take-livesessions.com`

## Assets still to add

- `public/logo-white.png` — white logo on transparent (used when provided)
- Session stills/gallery per session (add to `public/sessions/<slug>/`)
