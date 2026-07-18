import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import { getMoviesByCategory } from "@/services/movies";

const LABELS: Record<string, string> = {
  acao: "Ação 🔥",
  terror: "Terror 👻",
  comedia: "Comédia 😂",
  ficcao: "Ficção Científica 🚀",
  documentarios: "Documentários 🎥",
  filmes: "Filmes",
  series: "Séries",
  lancamentos: "Lançamentos",
};

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const movies = await getMoviesByCategory(params.slug);
  const label = LABELS[params.slug] || params.slug;

  return (
    <main>
      <Navbar />
      <div className="pt-28 pb-20">
        <h1 className="text-3xl font-display px-6 md:px-12 mb-6">{label}</h1>
        <MovieRow
          title=""
          basePath="filme"
          items={movies.map((m) => ({ id: m.id, title: m.title, poster: m.poster }))}
        />
      </div>
    </main>
  );
}
