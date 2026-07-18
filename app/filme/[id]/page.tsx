// Página sempre renderizada no servidor a cada requisição —
// evita servir contagens/imagens desatualizadas do Supabase em cache.
export const dynamic = "force-dynamic";
export const revalidate = 0;

import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import LoginToWatch from "@/components/LoginToWatch";
import { getMovieById } from "@/services/movies";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function FilmePage({ params }: { params: { id: string } }) {
  const movie = await getMovieById(params.id);
  if (!movie) return notFound();

  const supabase = createClient();

  const { data: sources } = await supabase
    .from("video_sources")
    .select("*")
    .eq("movie_id", movie.id);

  const { data: subs } = await supabase
    .from("subtitles")
    .select("*")
    .eq("movie_id", movie.id);

  const { data: authData } = await supabase.auth.getUser();
  let startAt = 0;
  if (authData?.user) {
    const { data: progress } = await supabase
      .from("watch_progress")
      .select("progress_seconds")
      .eq("user_id", authData.user.id)
      .eq("movie_id", movie.id)
      .single();
    startAt = progress?.progress_seconds || 0;
  }

  const bestSource =
    sources?.find((s) => s.quality === "1080p") || sources?.[0] || null;
  const playUrl = bestSource?.video_url || movie.trailer_url || "";

  return (
    <main>
      <Navbar />
      <div className="pt-24 px-6 md:px-12 pb-20 max-w-5xl mx-auto">
        {!authData?.user ? (
          <LoginToWatch redirectTo={`/filme/${movie.id}`} />
        ) : playUrl ? (
          <VideoPlayer
            url={playUrl}
            movieId={movie.id}
            userId={authData.user.id}
            startAt={startAt}
            subtitleUrl={subs?.[0]?.file_url}
          />
        ) : (
          <div className="aspect-video bg-neutral-900 flex items-center justify-center text-neutral-500 rounded">
            Nenhuma fonte de vídeo cadastrada para este título
          </div>
        )}

        <h1 className="font-display text-4xl mt-6">{movie.title}</h1>
        <div className="flex flex-wrap gap-3 text-sm text-neutral-400 mt-2">
          {movie.release_year && <span>{movie.release_year}</span>}
          {movie.duration && <span>{movie.duration} min</span>}
          {movie.age_rating && <span className="border border-neutral-600 px-1 rounded">{movie.age_rating}</span>}
          {movie.language && <span>{movie.language}</span>}
        </div>
        {movie.description && <p className="mt-4 text-neutral-200 max-w-2xl">{movie.description}</p>}

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-neutral-400 max-w-lg">
          {movie.director && (
            <div>
              <p className="text-neutral-500">Direção</p>
              <p className="text-white">{movie.director}</p>
            </div>
          )}
          {movie.cast_members && movie.cast_members.length > 0 && (
            <div>
              <p className="text-neutral-500">Elenco</p>
              <p className="text-white">{movie.cast_members.join(", ")}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
