"use client";

import { useEffect, useState } from "react";

type VideoSource = {
  id: number;
  quality: string;
  language: string;
  video_url: string;
};

type Subtitle = {
  id: number;
  language: string;
  label: string;
  file_url: string;
};

export default function VideoSourcesManager({ movieId }: { movieId: number }) {
  const [sources, setSources] = useState<VideoSource[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [loading, setLoading] = useState(true);

  const [newUrl, setNewUrl] = useState("");
  const [newQuality, setNewQuality] = useState("1080p");
  const [savingSource, setSavingSource] = useState(false);

  const [subUrl, setSubUrl] = useState("");
  const [subLabel, setSubLabel] = useState("Português");
  const [savingSub, setSavingSub] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [sRes, cRes] = await Promise.all([
      fetch(`/api/admin/video-sources?movie_id=${movieId}`).then((r) => r.json()),
      fetch(`/api/admin/subtitles?movie_id=${movieId}`).then((r) => r.json()),
    ]);
    setSources(sRes.data || []);
    setSubtitles(cRes.data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  function detectSourceLabel(url: string) {
    if (/youtube\.com|youtu\.be/.test(url)) return "YouTube";
    if (/vimeo\.com/.test(url)) return "Vimeo";
    if (/supabase\.co\/storage/.test(url)) return "Supabase Storage";
    return "Link direto";
  }

  async function addSource() {
    if (!newUrl.trim()) return;
    setSavingSource(true);
    const res = await fetch("/api/admin/video-sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie_id: movieId, quality: newQuality, video_url: newUrl.trim() }),
    });
    setSavingSource(false);
    if (res.ok) {
      setNewUrl("");
      loadAll();
    } else {
      alert("Erro ao adicionar o vídeo. Confira o link e tente novamente.");
    }
  }

  async function removeSource(id: number) {
    if (!confirm("Remover esta fonte de vídeo?")) return;
    const res = await fetch(`/api/admin/video-sources/${id}`, { method: "DELETE" });
    if (res.ok) loadAll();
  }

  async function addSubtitle() {
    if (!subUrl.trim()) return;
    setSavingSub(true);
    const res = await fetch("/api/admin/subtitles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie_id: movieId, language: "pt", label: subLabel, file_url: subUrl.trim() }),
    });
    setSavingSub(false);
    if (res.ok) {
      setSubUrl("");
      loadAll();
    } else {
      alert("Erro ao adicionar a legenda.");
    }
  }

  async function removeSubtitle(id: number) {
    if (!confirm("Remover esta legenda?")) return;
    const res = await fetch(`/api/admin/subtitles/${id}`, { method: "DELETE" });
    if (res.ok) loadAll();
  }

  return (
    <div className="max-w-2xl mt-10 border-t border-neutral-800 pt-8">
      <h2 className="text-xl font-semibold mb-1">🎥 Fontes de vídeo</h2>
      <p className="text-sm text-neutral-500 mb-4">
        Cole o link do YouTube (não listado), Vimeo, Supabase Storage ou qualquer
        URL direta de .mp4 / .m3u8. O player detecta o tipo automaticamente.
      </p>

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando...</p>
      ) : (
        <div className="flex flex-col gap-2 mb-4">
          {sources.length === 0 && (
            <p className="text-sm text-neutral-500">Nenhuma fonte de vídeo cadastrada ainda.</p>
          )}
          {sources.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between bg-surface rounded px-3 py-2 text-sm"
            >
              <div className="truncate">
                <span className="text-accent font-medium mr-2">{s.quality}</span>
                <span className="text-neutral-500 mr-2">[{detectSourceLabel(s.video_url)}]</span>
                <span className="truncate">{s.video_url}</span>
              </div>
              <button
                onClick={() => removeSource(s.id)}
                className="text-neutral-500 hover:text-red-500 ml-3 flex-shrink-0"
              >
                excluir
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <select
          value={newQuality}
          onChange={(e) => setNewQuality(e.target.value)}
          className="bg-surface border border-neutral-700 rounded px-2 py-2 text-sm"
        >
          <option value="480p">480p</option>
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
        </select>
        <input
          placeholder="https://youtube.com/watch?v=... ou .mp4"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1 bg-surface border border-neutral-700 rounded px-3 py-2 text-sm"
        />
        <button
          onClick={addSource}
          disabled={savingSource}
          className="bg-accent hover:bg-red-700 transition-colors px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
        >
          {savingSource ? "..." : "Adicionar"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-1">💬 Legendas</h2>
      <p className="text-sm text-neutral-500 mb-4">
        Cole a URL de um arquivo <code>.vtt</code> hospedado (ex: Supabase Storage).
      </p>

      <div className="flex flex-col gap-2 mb-4">
        {subtitles.length === 0 && (
          <p className="text-sm text-neutral-500">Nenhuma legenda cadastrada ainda.</p>
        )}
        {subtitles.map((s) => (
          <div key={s.id} className="flex items-center justify-between bg-surface rounded px-3 py-2 text-sm">
            <div className="truncate">
              <span className="text-accent font-medium mr-2">{s.label}</span>
              <span className="truncate">{s.file_url}</span>
            </div>
            <button
              onClick={() => removeSubtitle(s.id)}
              className="text-neutral-500 hover:text-red-500 ml-3 flex-shrink-0"
            >
              excluir
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          placeholder="Rótulo (ex: Português)"
          value={subLabel}
          onChange={(e) => setSubLabel(e.target.value)}
          className="w-40 bg-surface border border-neutral-700 rounded px-3 py-2 text-sm"
        />
        <input
          placeholder="https://.../legenda.vtt"
          value={subUrl}
          onChange={(e) => setSubUrl(e.target.value)}
          className="flex-1 bg-surface border border-neutral-700 rounded px-3 py-2 text-sm"
        />
        <button
          onClick={addSubtitle}
          disabled={savingSub}
          className="bg-accent hover:bg-red-700 transition-colors px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
        >
          {savingSub ? "..." : "Adicionar"}
        </button>
      </div>
    </div>
  );
}
