"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dict } from "@/lib/i18n";
import { Diamonds } from "@/components/ui";

export default function NotFound() {
  const [he, setHe] = useState(false);

  useEffect(() => {
    const cookieLang = document.cookie.match(/take-lang=(\w+)/)?.[1];
    const langs = [navigator.language, ...(navigator.languages || [])].map((l) => (l || "").toLowerCase());
    const browserHe = langs.some((l) => l.startsWith("he"));
    setHe(browserHe || cookieLang === "he");
  }, []);

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
