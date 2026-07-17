import Link from "next/link";
import { cookies, headers } from "next/headers";
import { dict } from "@/lib/i18n";
import { Diamonds } from "@/components/ui";

export default async function NotFound() {
  const [c, h] = await Promise.all([cookies(), headers()]);
  const lang =
    c.get("take-lang")?.value ??
    (h.get("x-vercel-ip-country") === "IL" ? "he" : "en");
  const he = lang === "he";
  const t = he ? dict.he.notFound : dict.en.notFound;

  return (
    <main
      dir={he ? "rtl" : "ltr"}
      className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <Diamonds className="h-7 w-auto text-[var(--muted)]" />
      <p className="display text-7xl">404</p>
      <h1 className="display text-2xl">{t.title}</h1>
      <p className="max-w-sm text-[var(--muted)]">{t.p}</p>
      <Link href={he ? "/he" : "/"} className="btn btn-primary mt-4">
        {t.cta}
      </Link>
    </main>
  );
}
