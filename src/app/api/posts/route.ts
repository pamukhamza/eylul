import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { cleanPostHtml } from "@/lib/sanitize";

const createSchema = z.object({
  title: z.string().trim().min(1, "Baslik bos olamaz").max(500),
  content: z.string().min(1, "Icerik bos olamaz"),
});

export async function GET(req: NextRequest) {
  if (!(await requireUser())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const showDeleted = req.nextUrl.searchParams.get("deleted") === "1";
  const q = req.nextUrl.searchParams.get("q")?.trim();

  const posts = await prisma.post.findMany({
    where: {
      deleted: showDeleted,
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { content: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, createdAt: true, updatedAt: true, deleted: true },
  });

  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  if (!(await requireUser())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Gecersiz istek." }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Gecersiz veri." },
      { status: 400 }
    );
  }
  const post = await prisma.post.create({
    data: {
      title: parsed.data.title,
      content: cleanPostHtml(parsed.data.content),
    },
  });
  return NextResponse.json({ post });
}
