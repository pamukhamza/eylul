import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PostListItem from "@/components/PostListItem";

export const metadata = { title: "Yazılar" };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const search = q?.trim() ?? "";

  const posts = await prisma.post.findMany({
    where: {
      deleted: false,
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { content: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, createdAt: true, updatedAt: true },
  });

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900">Yazılar</h1>
          <p className="text-sm text-stone-500 mt-1">
            {posts.length} yazı{search ? ` · "${search}" için sonuç` : ""}
          </p>
        </div>
        <form className="flex gap-2" action="/" method="get">
          <input
            name="q"
            defaultValue={search}
            placeholder="Ara…"
            className="flex-1 sm:w-64 rounded-lg border border-stone-300 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800"
          >
            Bul
          </button>
        </form>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <p className="text-stone-600">
            {search ? "Aramayla eşleşen yazı bulunamadı." : "Henüz hiç yazı yok."}
          </p>
          <Link
            href="/yazi/yeni"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white"
          >
            İlk yazını ekle
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <PostListItem key={p.id} post={p} />
          ))}
        </ul>
      )}
    </section>
  );
}
