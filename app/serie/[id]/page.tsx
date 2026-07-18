import Navbar from "@/components/Navbar";
import { getSeriesById, getSeasonsBySeries, getEpisodesBySeason } from "@/services/series";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SeriePage({ params }: { params: { id: string } }) {
  const series = await getSeriesById(params.id);
  if (!series) return notFound();

  const seasons = await getSeasonsBySeries(series.id);
  const seasonsWithEpisodes = await Promise.all(
    seasons.map(async (season) => ({
      season,
      episodes: await getEpisodesBySeason(season.id),
    }))
  );

  return (
    <main>
      <Navbar />
      <div
        className="pt-32 pb-10 px-6 md:px-12 bg-cover bg-center"
        style={{ backgroundImage: `url(${series.banner || series.poster || ""})` }}
      >
        <h1 className="font-display text-5xl">{series.title}</h1>
        {series.description && <p className="mt-3 max-w-2xl text-neutral-200">{series.description}</p>}
        <div className="flex gap-3 text-sm text-neutral-400 mt-2">
          {series.release_year && <span>{series.release_year}</span>}
          {series.genre && <span>{series.genre}</span>}
        </div>
      </div>

      <div className="px-6 md:px-12 pb-20">
        <h2 className="text-2xl font-semibold mt-6 mb-4">Temporadas</h2>
        {seasonsWithEpisodes.map(({ season, episodes }) => (
          <div key={season.id} className="mb-8">
            <h3 className="text-lg text-accent mb-3">
              Temporada {season.season_number} {season.title ? `— ${season.title}` : ""}
            </h3>
            <div className="flex flex-col gap-2">
              {episodes.map((ep) => (
                <Link
                  key={ep.id}
                  href={`/filme/${ep.id}?tipo=episodio`}
                  className="flex items-center gap-4 bg-surface rounded p-3 hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-28 aspect-video bg-neutral-800 rounded overflow-hidden flex-shrink-0">
                    {ep.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ep.thumbnail} alt={ep.title || ""} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {ep.episode_number}. {ep.title}
                    </p>
                    {ep.description && (
                      <p className="text-sm text-neutral-400 line-clamp-2">{ep.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
