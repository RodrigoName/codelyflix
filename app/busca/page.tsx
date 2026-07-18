// Página sempre renderizada no servidor a cada requisição —
// evita servir contagens/imagens desatualizadas do Supabase em cache.
export const dynamic = "force-dynamic";
export const revalidate = 0;

import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import { searchMovies } from "@/services/movies";

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q || "";
  const results = q ? await searchMovies(q) : [];

  return (
    <main>
      <Navbar />
      <div className="pt-28 px-6 md:px-12 pb-20">
        <h1 className="text-2xl font-semibold mb-6">
          {q ? `Resultados para "${q}"` : "Digite algo para buscar"}
        </h1>
        {q && results.length === 0 && (
          <p className="text-neutral-400">Nenhum título encontrado.</p>
        )}
        <MovieRow
          title=""
          basePath="filme"
          items={results.map((m) => ({ id: m.id, title: m.title, poster: m.poster }))}
        />
      </div>
    </main>
  );
}
