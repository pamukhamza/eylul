import { prisma } from "@/lib/prisma";
import PostListItem from "@/components/PostListItem";

export const metadata = { title: "Çöp kutusu" };

export default async function TrashedPage() {
  const posts = await prisma.post.findMany({
    where: { deleted: true },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, createdAt: true, updatedAt: true },
  });

  return (
    <section>
      <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-2">
        Çöp kutusu
      </h1>
      <p className="text-sm text-stone-500 mb-6">
        Silinen yazılar burada saklanır. Geri yükleyebilirsiniz; veritabanından
        kaldırılmaz.
      </p>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">
          Silinen yazı yok.
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <PostListItem key={p.id} post={p} trashed />
          ))}
        </ul>
      )}
    </section>
  );
}
