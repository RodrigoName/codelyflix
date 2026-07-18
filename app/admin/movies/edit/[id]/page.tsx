// Página sempre renderizada no servidor a cada requisição —
// evita servir contagens/imagens desatualizadas do Supabase em cache.
export const dynamic = "force-dynamic";
export const revalidate = 0;

import MovieForm from "@/components/admin/MovieForm";
import VideoSourcesManager from "@/components/admin/VideoSourcesManager";
import { getMovieById } from "@/services/movies";
import { notFound } from "next/navigation";

export default async function EditMoviePage({ params }: { params: { id: string } }) {
  const movie = await getMovieById(params.id);
  if (!movie) return notFound();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Editar Filme</h1>
      <MovieForm initial={movie} />
      <VideoSourcesManager movieId={movie.id} />
    </div>
  );
}
