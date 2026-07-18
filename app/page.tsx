// Página sempre renderizada no servidor a cada requisição —
// evita servir contagens/imagens desatualizadas do Supabase em cache.
export const dynamic = "force-dynamic";
export const revalidate = 0;

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import ContinueWatching from "@/components/ContinueWatching";
import { getMovies, getFeaturedMovies } from "@/services/movies";
import { getSeries } from "@/services/series";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const [movies, featured, series] = await Promise.all([
    getMovies(),
    getFeaturedMovies(),
    getSeries(),
  ]);

  const hero = featured[0] || movies[0];

  // Continuar assistindo (se o usuário estiver logado)
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  let continueItems: any[] = [];
  if (authData?.user) {
    const { data: progress } = await supabase
      .from("watch_progress")
      .select("movie_id, progress_seconds, duration, movies(*)")
      .eq("user_id", authData.user.id)
      .order("updated_at", { ascending: false })
      .limit(10);
    continueItems = (progress || []).map((p: any) => ({
      movie: p.movies,
      progress_seconds: p.progress_seconds,
      duration: p.duration,
    }));
  }

  return (
    <main>
      <Navbar />
      {hero && <Hero movie={hero} />}

      <div className="pt-6 pb-20">
        <ContinueWatching items={continueItems} />
        <MovieRow
          title="🔥 Em destaque"
          basePath="filme"
          items={featured.map((m) => ({ id: m.id, title: m.title, poster: m.poster }))}
        />
        <MovieRow
          title="Filmes"
          basePath="filme"
          items={movies.map((m) => ({ id: m.id, title: m.title, poster: m.poster }))}
        />
        <MovieRow
          title="Séries"
          basePath="serie"
          items={series.map((s) => ({ id: s.id, title: s.title, poster: s.poster }))}
        />
      </div>
    </main>
  );
}
