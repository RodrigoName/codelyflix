import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movie_id");
  if (!movieId) return NextResponse.json({ error: "movie_id é obrigatório" }, { status: 400 });

  const { data, error } = await supabaseAdmin()
    .from("subtitles")
    .select("*")
    .eq("movie_id", movieId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.movie_id || !body.file_url) {
    return NextResponse.json({ error: "movie_id e file_url são obrigatórios" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("subtitles")
    .insert({
      movie_id: body.movie_id,
      language: body.language || "pt",
      label: body.label || "Português",
      file_url: body.file_url,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
