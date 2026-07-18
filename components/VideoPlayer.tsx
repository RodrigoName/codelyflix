"use client";

import { useRef } from "react";
import ReactPlayer from "react-player";

export default function VideoPlayer({
  url,
  movieId,
  userId,
  startAt = 0,
  subtitleUrl,
}: {
  url: string;
  movieId: number;
  userId?: string | null;
  startAt?: number;
  subtitleUrl?: string | null;
}) {
  const lastSaved = useRef(0);
  const playerRef = useRef<ReactPlayer>(null);

  async function saveProgress(seconds: number, duration: number) {
    if (!userId) return;
    // Evita salvar a cada frame — salva a cada 5s de progresso real
    if (Math.abs(seconds - lastSaved.current) < 5) return;
    lastSaved.current = seconds;

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        movieId,
        time: Math.floor(seconds),
        duration: Math.floor(duration),
      }),
    });
  }

  return (
    <div className="aspect-video w-full bg-black rounded overflow-hidden">
      <ReactPlayer
        ref={playerRef}
        url={url}
        controls
        width="100%"
        height="100%"
        playing
        progressInterval={5000}
        onReady={() => {
          if (startAt > 0) playerRef.current?.seekTo(startAt, "seconds");
        }}
        onProgress={({ playedSeconds }) => {
          const duration = playerRef.current?.getDuration() || 0;
          saveProgress(playedSeconds, duration);
        }}
        config={{
          file: {
            tracks: subtitleUrl
              ? [{ kind: "subtitles", src: subtitleUrl, srcLang: "pt", label: "Português", default: true }]
              : [],
          },
        }}
      />
    </div>
  );
}
