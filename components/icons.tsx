/* אייקוני פלטפורמות בקו של האתר — מונוכרום, עדינים */
export function YtIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 20" fill="currentColor" className={className} aria-hidden>
      <path d="M27.4 3.1A3.5 3.5 0 0 0 25 .7C22.8.1 14 .1 14 .1S5.2.1 3 .7A3.5 3.5 0 0 0 .6 3.1 36.6 36.6 0 0 0 0 10a36.6 36.6 0 0 0 .6 6.9A3.5 3.5 0 0 0 3 19.3c2.2.6 11 .6 11 .6s8.8 0 11-.6a3.5 3.5 0 0 0 2.4-2.4A36.6 36.6 0 0 0 28 10a36.6 36.6 0 0 0-.6-6.9ZM11.2 14.3V5.7L18.5 10l-7.3 4.3Z" />
    </svg>
  );
}

export function SpotifyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.5 17.3a.75.75 0 0 1-1 .25c-2.8-1.7-6.4-2.1-10.6-1.2a.75.75 0 1 1-.32-1.46c4.6-1 8.5-.55 11.7 1.35.35.21.46.67.25 1.03Zm1.47-3.27a.94.94 0 0 1-1.29.3c-3.2-2-8.1-2.6-11.9-1.4a.94.94 0 1 1-.55-1.8c4.3-1.3 9.7-.66 13.4 1.6.44.27.58.85.3 1.3Zm.13-3.4C15.3 8.35 9 8.13 5.3 9.25a1.13 1.13 0 1 1-.65-2.16c4.2-1.27 11.2-1.03 15.6 1.55a1.13 1.13 0 0 1-1.15 1.94Z" />
    </svg>
  );
}

export function AppleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.9 1.2c.1 1-.3 2-1 2.8-.7.8-1.8 1.4-2.8 1.3-.1-1 .4-2 1-2.7.7-.8 1.9-1.4 2.8-1.4ZM20.6 8.2c-.1.06-2.2 1.28-2.2 3.9 0 3.06 2.7 4.14 2.8 4.17-.02.07-.44 1.5-1.44 2.96-.9 1.3-1.84 2.57-3.3 2.57-1.44 0-1.9-.85-3.58-.85-1.65 0-2.24.88-3.56.88-1.34 0-2.27-1.2-3.28-2.66C4.9 17.5 4 14.9 4 12.4c0-4 2.6-6.1 5.14-6.1 1.4 0 2.55.92 3.42.92.84 0 2.14-.98 3.72-.98.6 0 2.76.06 4.32 2Z" />
    </svg>
  );
}

export function InstaIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="17.6" cy="6.4" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}
