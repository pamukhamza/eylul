import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { cleanPostHtml } from "@/lib/sanitize";

const updateSchema = z.object({
  title: z.string().trim().min(1).max(500),
  content: z.string().min(1),
});

function parseId(s: string) {
  const n = Number(s);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await requireUser())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const pid = parseId(id);
  if (!pid) return NextResponse.json({ error: "Gecersiz id." }, { status: 400 });

  const post = await prisma.post.findFirst({ where: { id: pid } });
  if (!post) return NextResponse.json({ error: "Bulunamadi." }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await requireUser())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const pid = parseId(id);
  if (!pid) return NextResponse.json({ error: "Gecersiz id." }, { status: 400 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Gecersiz istek." }, { status: 400 });
  }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Gecersiz veri." },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.post.update({
      where: { id: pid },
      data: {
        title: parsed.data.title,
        content: cleanPostHtml(parsed.data.content),
      },
    });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Guncellenemedi." }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await requireUser())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const pid = parseId(id);
  if (!pid) return NextResponse.json({ error: "Gecersiz id." }, { status: 400 });

  try {
    await prisma.post.update({
      where: { id: pid },
      data: { deleted: true },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Silinemedi." }, { status: 404 });
  }
}
