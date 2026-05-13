"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-3 py-1.5 rounded-lg text-stone-600 hover:bg-stone-100 disabled:opacity-60"
      title="Çıkış"
    >
      {loading ? "…" : "Çıkış"}
    </button>
  );
}
