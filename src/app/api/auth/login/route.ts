import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { rateLimit, resetRateLimit } from "@/lib/rateLimit";

const schema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";
  const rl = rateLimit(`login:${ip}`, 5, 5 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Cok fazla deneme. ${rl.retryAfter} sn sonra tekrar deneyin.` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Gecersiz istek." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Eksik veya hatali bilgi." }, { status: 400 });
  }

  const { username, password } = parsed.data;
  const envUser = process.env.AUTH_USERNAME;
  const envHash = process.env.AUTH_PASSWORD_HASH;

  if (!envUser || !envHash) {
    return NextResponse.json({ error: "Sunucu yapilandirmasi eksik." }, { status: 500 });
  }

  const userMatch = username === envUser;
  const pwMatch = await bcrypt.compare(password, envHash);

  if (!userMatch || !pwMatch) {
    return NextResponse.json(
      { error: "Kullanici adi veya parola hatali." },
      { status: 401 }
    );
  }

  const session = await getSession();
  session.user = envUser;
  session.loginAt = Date.now();
  await session.save();
  resetRateLimit(`login:${ip}`);

  return NextResponse.json({ ok: true });
}
