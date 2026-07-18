import Link from "next/link";
import { Movie } from "@/types";

type Item = { movie: Movie; progress_seconds: number; duration: number | null };

export default function ContinueWatching({ items }: { items: Item[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="px-6 md:px-12 mb-10">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Continuar assistindo</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {items.map(({ movie, progress_seconds, duration }) => {
          const pct = duration ? Math.min(100, Math.round((progress_seconds / duration) * 100)) : 0;
          return (
            <Link
              key={movie.id}
              href={`/filme/${movie.id}`}
              className="flex-shrink-0 w-64 rounded overflow-hidden bg-surface card-hover"
            >
              <div className="relative aspect-video bg-neutral-800">
                {movie.banner || movie.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={movie.banner || movie.poster || ""}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center text-3xl">▶</div>
              </div>
              <div className="p-2">
                <p className="text-sm truncate mb-1">{movie.title}</p>
                <div className="h-1 bg-neutral-700 rounded">
                  <div className="h-1 bg-accent rounded" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
