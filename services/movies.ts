import { createClient } from "@/lib/supabase/server";
import { Movie } from "@/types";

export async function getMovies(): Promise<Movie[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Movie[];
}

export async function getFeaturedMovies(): Promise<Movie[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("status", "active")
    .eq("featured", true);
  if (error) throw error;
  return data as Movie[];
}

export async function getMoviesByCategory(category: string): Promise<Movie[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("status", "active")
    .eq("category", category);
  if (error) throw error;
  return data as Movie[];
}

export async function getMovieById(id: number | string): Promise<Movie | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Movie;
}

export async function searchMovies(term: string): Promise<Movie[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("status", "active")
    .textSearch("title", term, { type: "websearch", config: "portuguese" });
  if (error) throw error;
  return data as Movie[];
}
