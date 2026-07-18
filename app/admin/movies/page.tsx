import Link from "next/link";
import { getMovies } from "@/services/movies";

export default async function MoviesAdmin() {
  const movies = await getMovies();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Gerenciar Filmes</h1>
        <Link
          href="/admin/movies/new"
          className="bg-accent hover:bg-red-700 transition-colors px-4 py-2 rounded text-sm font-medium"
        >
          + Novo Filme
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-surface rounded p-3">
            <div className="aspect-[2/3] bg-neutral-800 rounded overflow-hidden mb-2">
              {movie.poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
              )}
            </div>
            <h2 className="text-sm truncate">{movie.title}</h2>
            <Link
              href={`/admin/movies/edit/${movie.id}`}
              className="text-accent text-xs hover:underline"
            >
              Editar
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
