import Link from "next/link";
import { dict } from "@/lib/i18n";
import { Diamonds } from "@/components/ui";

export default function NotFound() {
  const t = dict.he.notFound;
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <Diamonds className="h-7 w-auto text-[var(--muted)]" />
      <p className="display text-7xl">404</p>
      <h1 className="display text-2xl">{t.title}</h1>
      <p className="max-w-sm text-[var(--muted)]">{t.p}</p>
      <Link href="/he" className="btn btn-primary mt-4">{t.cta}</Link>
    </main>
  );
}
