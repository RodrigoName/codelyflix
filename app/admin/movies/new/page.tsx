import MovieForm from "@/components/admin/MovieForm";

export default function NewMoviePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">Novo Filme</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Preencha os dados e salve — na próxima tela você já vai poder colar o
        link do vídeo (YouTube, Vimeo, etc.) e das legendas.
      </p>
      <MovieForm />
    </div>
  );
}
