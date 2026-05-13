"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  post: {
    id: number;
    title: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  };
  trashed?: boolean;
};

function fmt(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function PostListItem({ post, trashed }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("Bu yazıyı çöp kutusuna taşımak istiyor musunuz?")) return;
    setBusy(true);
    const r = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    setBusy(false);
    if (r.ok) router.refresh();
    else alert("İşlem başarısız.");
  }

  async function onRestore() {
    setBusy(true);
    const r = await fetch(`/api/posts/${post.id}/restore`, { method: "POST" });
    setBusy(false);
    if (r.ok) router.refresh();
    else alert("İşlem başarısız.");
  }

  return (
    <li className="rounded-2xl border border-stone-200 bg-white hover:shadow-sm transition p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={trashed ? "#" : `/yazi/${post.id}`}
            className="block font-serif text-lg sm:text-xl text-stone-900 hover:text-amber-800 truncate"
          >
            {post.title || "(Başlıksız)"}
          </Link>
          <div className="text-xs text-stone-500 mt-1">
            {fmt(post.createdAt)}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {trashed ? (
            <button
              onClick={onRestore}
              disabled={busy}
              className="text-sm px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-60"
            >
              Geri yükle
            </button>
          ) : (
            <>
              <Link
                href={`/yazi/${post.id}`}
                className="text-sm px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800"
              >
                Düzenle
              </Link>
              <button
                onClick={onDelete}
                disabled={busy}
                className="text-sm px-3 py-1.5 rounded-lg text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                Sil
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
