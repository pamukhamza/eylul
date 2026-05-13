import Link from "next/link";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Eylülün Defteri";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Link href="/" className="font-serif text-lg sm:text-xl text-stone-900 truncate">
            {siteName}
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3 text-sm">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg hover:bg-stone-100 text-stone-700"
            >
              Yazılar
            </Link>
            <Link
              href="/yazi/yeni"
              className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white"
            >
              Yeni
            </Link>
            <Link
              href="/yazilar/silinen"
              className="hidden sm:inline px-3 py-1.5 rounded-lg hover:bg-stone-100 text-stone-600"
            >
              Çöp kutusu
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {children}
        </div>
      </main>
      <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {siteName}
      </footer>
    </div>
  );
}
