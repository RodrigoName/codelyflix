import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import { createClient } from "@/lib/supabase/server";

export default async function MinhaListaPage() {
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();

  let movies: any[] = [];
  if (authData?.user) {
    const { data } = await supabase
      .from("favorites")
      .select("movies(*)")
      .eq("user_id", authData.user.id);
    movies = (data || []).map((f: any) => f.movies);
  }

  return (
    <main>
      <Navbar />
      <div className="pt-28 pb-20">
        <h1 className="text-3xl font-display px-6 md:px-12 mb-6">❤️ Minha Lista</h1>
        {!authData?.user && (
          <p className="px-6 md:px-12 text-neutral-400">Faça login para ver seus favoritos.</p>
        )}
        <MovieRow
          title=""
          basePath="filme"
          items={movies.map((m) => ({ id: m.id, title: m.title, poster: m.poster }))}
        />
      </div>
    </main>
  );
}
