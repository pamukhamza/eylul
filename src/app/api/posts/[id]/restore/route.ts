import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await requireUser())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const pid = Number(id);
  if (!Number.isInteger(pid) || pid <= 0) {
    return NextResponse.json({ error: "Gecersiz id." }, { status: 400 });
  }
  try {
    await prisma.post.update({ where: { id: pid }, data: { deleted: false } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Geri yuklenemedi." }, { status: 404 });
  }
}
