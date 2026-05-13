"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "./Editor";

type Props = {
  initial?: {
    id: number;
    title: string;
    content: string;
  };
};

export default function PostForm({ initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!title.trim()) {
      setErr("Başlık boş olamaz.");
      return;
    }
    const stripped = content.replace(/<[^>]*>/g, "").trim();
    if (!stripped) {
      setErr("İçerik boş olamaz.");
      return;
    }
    setSaving(true);
    try {
      const url = initial ? `/api/posts/${initial.id}` : `/api/posts`;
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error ?? "Kaydedilemedi.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setErr("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        autoFocus={!initial}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Başlık"
        maxLength={500}
        className="w-full text-2xl sm:text-3xl font-serif bg-transparent outline-none border-b border-stone-200 focus:border-amber-400 pb-2"
      />

      <Editor value={content} onChange={setContent} />

      {err && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {err}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800"
        >
          Vazgeç
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white"
        >
          {saving ? "Kaydediliyor…" : initial ? "Güncelle" : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
