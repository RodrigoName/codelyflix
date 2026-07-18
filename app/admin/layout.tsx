import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-base text-white">
      <aside className="w-56 bg-surface p-6 flex flex-col gap-4">
        <h1 className="font-display text-xl text-accent mb-6">CodelyFlix Admin</h1>
        <Link href="/admin" className="hover:text-accent">📊 Dashboard</Link>
        <Link href="/admin/movies" className="hover:text-accent">🎬 Filmes</Link>
        <Link href="/admin/series" className="hover:text-accent">📺 Séries</Link>
        <Link href="/" className="text-neutral-500 hover:text-white mt-auto text-sm">
          ← Voltar ao site
        </Link>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
