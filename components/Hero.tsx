import Link from "next/link";
import { Movie } from "@/types";

export default function Hero({ movie }: { movie: Movie }) {
  if (!movie) return null;

  return (
    <section
      className="relative h-[85vh] w-full bg-cover bg-center flex items-end"
      style={{ backgroundImage: `url(${movie.banner || movie.poster || ""})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-base via-black/40 to-transparent" />
      <div className="relative z-10 px-6 md:px-12 pb-20 max-w-2xl">
        <h1 className="font-display text-5xl md:text-7xl mb-4 tracking-wide drop-shadow-lg">
          {movie.title}
        </h1>
        {movie.description && (
          <p className="text-neutral-200 text-sm md:text-base mb-6 line-clamp-3">
            {movie.description}
          </p>
        )}
        <div className="flex gap-3">
          <Link
            href={`/filme/${movie.id}`}
            className="bg-white text-black font-semibold px-6 py-2.5 rounded flex items-center gap-2 hover:bg-neutral-200 transition-colors"
          >
            ▶ Assistir
          </Link>
          <Link
            href={`/filme/${movie.id}`}
            className="bg-neutral-700/70 px-6 py-2.5 rounded hover:bg-neutral-600 transition-colors"
          >
            + Minha Lista
          </Link>
        </div>
      </div>
    </section>
  );
}
