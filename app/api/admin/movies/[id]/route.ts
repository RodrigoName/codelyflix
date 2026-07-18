import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();

  const { data, error } = await supabaseAdmin()
    .from("movies")
    .update({
      title: body.title,
      description: body.description,
      poster: body.poster,
      banner: body.banner,
      category: body.category,
      trailer_url: body.trailer_url,
      director: body.director,
      cast_members: body.cast_members,
      duration: body.duration,
      language: body.language,
      age_rating: body.age_rating,
      country: body.country,
      release_year: body.release_year,
      featured: body.featured,
      premium: body.premium,
      status: body.status,
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabaseAdmin().from("movies").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
