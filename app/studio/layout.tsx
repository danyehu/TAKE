import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "TAKE Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain font-[family-name:var(--font-sans-he)]">{children}</body>
    </html>
  );
}
