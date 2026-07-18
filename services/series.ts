import { createClient } from "@/lib/supabase/server";
import { Series, Season, Episode } from "@/types";

export async function getSeries(): Promise<Series[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("series")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Series[];
}

export async function getSeriesById(id: number | string): Promise<Series | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("series").select("*").eq("id", id).single();
  if (error) return null;
  return data as Series;
}

export async function getSeasonsBySeries(seriesId: number | string): Promise<Season[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("seasons")
    .select("*")
    .eq("series_id", seriesId)
    .order("season_number", { ascending: true });
  if (error) throw error;
  return data as Season[];
}

export async function getEpisodesBySeason(seasonId: number | string): Promise<Episode[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("season_id", seasonId)
    .order("episode_number", { ascending: true });
  if (error) throw error;
  return data as Episode[];
}
