import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movie_id");
  if (!movieId) return NextResponse.json({ error: "movie_id é obrigatório" }, { status: 400 });

  const { data, error } = await supabaseAdmin()
    .from("video_sources")
    .select("*")
    .eq("movie_id", movieId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.movie_id || !body.video_url) {
    return NextResponse.json({ error: "movie_id e video_url são obrigatórios" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("video_sources")
    .insert({
      movie_id: body.movie_id,
      quality: body.quality || "1080p",
      language: body.language || "pt-BR",
      video_url: body.video_url,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
