import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== "/") return NextResponse.next();
  if (req.cookies.get("take-geo")) return NextResponse.next();

  const country = req.headers.get("x-vercel-ip-country") ?? "";
  const res =
    country === "IL"
      ? NextResponse.redirect(new URL("/he", req.url))
      : NextResponse.next();
  res.cookies.set("take-geo", "1", { maxAge: 60 * 60 * 24 * 30, path: "/" });
  return res;
}

export const config = { matcher: ["/"] };
