import { NextRequest, NextResponse } from "next/server";

const FILE_PATH = "lib/content.json";

function env() {
  return {
    password: process.env.ADMIN_PASSWORD || "",
    token: process.env.GITHUB_TOKEN || "",
    repo: process.env.GITHUB_REPO || "danyehu/TAKE",
  };
}

function authorized(req: NextRequest) {
  const { password } = env();
  return password && req.headers.get("x-admin-password") === password;
}

async function ghGet(repo: string, token: string) {
  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/${FILE_PATH}`,
    {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  return res.json();
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { token, repo } = env();
  try {
    const file = await ghGet(repo, token);
    const content = JSON.parse(Buffer.from(file.content, "base64").toString("utf-8"));
    return NextResponse.json({ content, sha: file.sha });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { token, repo } = env();
  try {
    const { content } = await req.json();
    const current = await ghGet(repo, token);
    const body = {
      message: "Content update via TAKE studio",
      content: Buffer.from(JSON.stringify(content, null, 2) + "\n").toString("base64"),
      sha: current.sha,
    };
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) throw new Error(`GitHub write failed: ${res.status} ${await res.text()}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** Upload an image (base64) into public/bts/ via a GitHub commit. */
export async function PUT(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { token, repo } = env();
  try {
    const { name, dataBase64 } = await req.json();
    const safe = String(name).toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/-+/g, "-");
    const path = `public/bts/${Date.now().toString(36)}-${safe}`;
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      body: JSON.stringify({ message: `Upload ${safe} via TAKE studio`, content: dataBase64 }),
    });
    if (!res.ok) throw new Error(`GitHub upload failed: ${res.status} ${await res.text()}`);
    return NextResponse.json({ path: path.replace("public", "") });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
