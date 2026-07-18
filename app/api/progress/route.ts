import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const body = await req.json();

  const { error } = await supabase.from("watch_progress").upsert(
    {
      user_id: body.userId,
      movie_id: body.movieId,
      progress_seconds: body.time,
      duration: body.duration,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,movie_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Também registra no histórico
  await supabase.from("watch_history").insert({
    user_id: body.userId,
    movie_id: body.movieId,
  });

  return NextResponse.json({ success: true });
}
