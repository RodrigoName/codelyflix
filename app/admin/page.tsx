import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function AdminDashboard() {
  const supabase = supabaseAdmin();
  const [{ count: totalMovies }, { count: totalSeries }, { count: totalUsers }] = await Promise.all([
    supabase.from("movies").select("*", { count: "exact", head: true }),
    supabase.from("series").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "Filmes cadastrados", value: totalMovies ?? 0, icon: "🎬" },
    { label: "Séries cadastradas", value: totalSeries ?? 0, icon: "📺" },
    { label: "Usuários", value: totalUsers ?? 0, icon: "👥" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-surface rounded p-6">
            <p className="text-3xl mb-2">{c.icon}</p>
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-neutral-400 text-sm">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
