import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "Giriş" };
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center px-4 py-10 bg-gradient-to-b from-amber-50 via-stone-50 to-stone-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-stone-900">
            {process.env.NEXT_PUBLIC_SITE_NAME ?? "Eylülün Defteri"}
          </h1>
          <p className="text-stone-500 mt-2 text-sm">Yazılar burada kitaba dönüşür.</p>
        </div>
        <Suspense fallback={<div className="text-center text-stone-500">Yükleniyor…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
