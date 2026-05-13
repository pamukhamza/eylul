"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const from = sp.get("from") ?? "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error ?? "Giriş başarısız.");
        return;
      }
      router.replace(from.startsWith("/") ? from : "/");
      router.refresh();
    } catch {
      setErr("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">
          Kullanıcı adı
        </label>
        <input
          autoFocus
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">
          Parola
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
          required
        />
      </div>

      {err && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {err}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-medium py-2.5 transition"
      >
        {loading ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
