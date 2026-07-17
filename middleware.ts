import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // כניסה ראשונה לדף הבית: הפניה לפי מדינה
  if (pathname === "/" && !req.cookies.get("take-geo")) {
    const country = req.headers.get("x-vercel-ip-country") ?? "";
    const res =
      country === "IL"
        ? NextResponse.redirect(new URL("/he", req.url))
        : NextResponse.next();
    res.cookies.set("take-geo", "1", { maxAge: 60 * 60 * 24 * 30, path: "/" });
    res.cookies.set("take-lang", country === "IL" ? "he" : "en", {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  }

  // בכל ביקור: זכירת השפה שבה גולשים בפועל
  const lang = pathname === "/he" || pathname.startsWith("/he/") ? "he" : "en";
  const res = NextResponse.next();
  res.cookies.set("take-lang", lang, { maxAge: 60 * 60 * 24 * 30, path: "/" });
  return res;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\.).*)"],
};
