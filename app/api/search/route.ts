import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category");
  const year = searchParams.get("year");

  let query = supabase.from("movies").select("*").eq("status", "active");

  if (q) {
    query = query.textSearch("title", q, { type: "websearch", config: "portuguese" });
  }
  if (category) query = query.eq("category", category);
  if (year) query = query.eq("release_year", Number(year));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
