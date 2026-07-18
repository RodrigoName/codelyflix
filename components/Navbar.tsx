"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [term, setTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (term.trim()) router.push(`/busca?q=${encodeURIComponent(term)}`);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    user?.email?.split("@")[0] ||
    "";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-gradient-to-b from-black/90 to-transparent">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-accent font-display text-3xl tracking-wide">
          CODELYFLIX
        </Link>
        <nav className="hidden md:flex gap-5 text-sm text-neutral-300">
          <Link href="/categoria/filmes" className="hover:text-white">Filmes</Link>
          <Link href="/categoria/series" className="hover:text-white">Séries</Link>
          <Link href="/categoria/lancamentos" className="hover:text-white">Lançamentos</Link>
          <Link href="/minha-lista" className="hover:text-white">Minha Lista</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="hidden sm:block">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar título, ator, categoria..."
            className="bg-black/50 border border-neutral-700 rounded px-3 py-1.5 text-sm w-56 focus:outline-none focus:border-accent"
          />
        </form>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 text-sm bg-neutral-800 hover:bg-neutral-700 transition-colors px-3 py-1.5 rounded"
            >
              <span className="w-6 h-6 rounded bg-accent flex items-center justify-center text-xs font-semibold uppercase">
                {displayName.charAt(0)}
              </span>
              <span className="hidden sm:inline max-w-[120px] truncate">{displayName}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-surface border border-neutral-700 rounded shadow-lg py-1 text-sm">
                <Link
                  href="/minha-lista"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-neutral-800"
                >
                  Minha Lista
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-neutral-800"
                >
                  Painel Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-red-400"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm bg-accent hover:bg-red-700 transition-colors px-4 py-1.5 rounded"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
