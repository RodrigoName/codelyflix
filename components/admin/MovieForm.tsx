"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Movie } from "@/types";

export default function MovieForm({ initial }: { initial?: Partial<Movie> & { id?: number } }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    poster: initial?.poster || "",
    banner: initial?.banner || "",
    category: initial?.category || "",
    trailer_url: initial?.trailer_url || "",
    director: initial?.director || "",
    cast_members: initial?.cast_members?.join(", ") || "",
    duration: initial?.duration || "",
    language: initial?.language || "Português",
    age_rating: initial?.age_rating || "",
    country: initial?.country || "",
    release_year: initial?.release_year || "",
    featured: initial?.featured || false,
    premium: initial?.premium || false,
    status: initial?.status || "active",
  });
  const [saving, setSaving] = useState(false);

  function update(field: string, value: any) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save() {
    setSaving(true);
    const payload = {
      ...form,
      cast_members: form.cast_members
        ? form.cast_members.split(",").map((s) => s.trim())
        : [],
      duration: form.duration ? Number(form.duration) : null,
      release_year: form.release_year ? Number(form.release_year) : null,
    };

    const url = isEdit ? `/api/admin/movies/${initial!.id}` : "/api/admin/movies";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      if (isEdit) {
        router.refresh();
      } else {
        // Ao criar um filme novo, vai direto para a edição
        // para já poder cadastrar a fonte de vídeo e legendas.
        const { data } = await res.json();
        router.push(`/admin/movies/edit/${data.id}`);
      }
    } else {
      alert("Erro ao salvar o filme.");
    }
  }

  async function remove() {
    if (!isEdit) return;
    if (!confirm("Excluir este filme permanentemente?")) return;
    const res = await fetch(`/api/admin/movies/${initial!.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/movies");
      router.refresh();
    }
  }

  return (
    <div className="max-w-2xl flex flex-col gap-4">
      <input
        placeholder="Título"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        className="bg-surface border border-neutral-700 rounded px-3 py-2"
      />
      <textarea
        placeholder="Descrição"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        className="bg-surface border border-neutral-700 rounded px-3 py-2 h-24"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="URL do Poster"
          value={form.poster}
          onChange={(e) => update("poster", e.target.value)}
          className="bg-surface border border-neutral-700 rounded px-3 py-2"
        />
        <input
          placeholder="URL do Banner"
          value={form.banner}
          onChange={(e) => update("banner", e.target.value)}
          className="bg-surface border border-neutral-700 rounded px-3 py-2"
        />
      </div>
      <input
        placeholder="URL do Trailer (YouTube/Vimeo)"
        value={form.trailer_url}
        onChange={(e) => update("trailer_url", e.target.value)}
        className="bg-surface border border-neutral-700 rounded px-3 py-2"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="Categoria (ex: acao, terror)"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="bg-surface border border-neutral-700 rounded px-3 py-2"
        />
        <input
          placeholder="Diretor"
          value={form.director}
          onChange={(e) => update("director", e.target.value)}
          className="bg-surface border border-neutral-700 rounded px-3 py-2"
        />
      </div>
      <input
        placeholder="Elenco (separado por vírgula)"
        value={form.cast_members}
        onChange={(e) => update("cast_members", e.target.value)}
        className="bg-surface border border-neutral-700 rounded px-3 py-2"
      />
      <div className="grid grid-cols-3 gap-4">
        <input
          placeholder="Duração (min)"
          type="number"
          value={form.duration}
          onChange={(e) => update("duration", e.target.value)}
          className="bg-surface border border-neutral-700 rounded px-3 py-2"
        />
        <input
          placeholder="Ano"
          type="number"
          value={form.release_year}
          onChange={(e) => update("release_year", e.target.value)}
          className="bg-surface border border-neutral-700 rounded px-3 py-2"
        />
        <input
          placeholder="Classificação (ex: 12 anos)"
          value={form.age_rating}
          onChange={(e) => update("age_rating", e.target.value)}
          className="bg-surface border border-neutral-700 rounded px-3 py-2"
        />
      </div>

      <div className="flex gap-6 items-center text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
          />
          Destaque na Home
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.premium}
            onChange={(e) => update("premium", e.target.checked)}
          />
          Conteúdo Premium
        </label>
        <select
          value={form.status}
          onChange={(e) => update("status", e.target.value)}
          className="bg-surface border border-neutral-700 rounded px-2 py-1"
        >
          <option value="active">Ativo</option>
          <option value="hidden">Oculto</option>
        </select>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={save}
          disabled={saving}
          className="bg-accent hover:bg-red-700 transition-colors px-6 py-2 rounded font-medium disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
        {isEdit && (
          <button
            onClick={remove}
            className="bg-neutral-800 hover:bg-neutral-700 transition-colors px-6 py-2 rounded"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
