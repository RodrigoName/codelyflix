// Página sempre renderizada no servidor a cada requisição —
// evita servir contagens/imagens desatualizadas do Supabase em cache.
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getSeries } from "@/services/series";

export default async function SeriesAdmin() {
  const series = await getSeries();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Gerenciar Séries</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {series.map((s) => (
          <div key={s.id} className="bg-surface rounded p-3">
            <div className="aspect-[2/3] bg-neutral-800 rounded overflow-hidden mb-2">
              {s.poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.poster} alt={s.title} className="w-full h-full object-cover" />
              )}
            </div>
            <h2 className="text-sm truncate">{s.title}</h2>
          </div>
        ))}
      </div>
      <p className="text-neutral-500 text-sm mt-6">
        Cadastro de temporadas e episódios: use o SQL editor do Supabase ou peça para eu gerar
        o CRUD completo na próxima etapa.
      </p>
    </div>
  );
}
