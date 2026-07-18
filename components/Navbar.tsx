"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [term, setTerm] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (term.trim()) router.push(`/busca?q=${encodeURIComponent(term)}`);
  }

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
        <Link
          href="/login"
          className="text-sm bg-accent hover:bg-red-700 transition-colors px-4 py-1.5 rounded"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
