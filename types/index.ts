export type Movie = {
  id: number;
  title: string;
  description: string | null;
  poster: string | null;
  banner: string | null;
  category: string | null;
  trailer_url: string | null;
  director: string | null;
  cast_members: string[] | null;
  duration: number | null;
  language: string | null;
  age_rating: string | null;
  country: string | null;
  release_year: number | null;
  featured: boolean;
  status: "active" | "hidden";
  premium: boolean;
  created_at: string;
};

export type Series = {
  id: number;
  title: string;
  description: string | null;
  poster: string | null;
  banner: string | null;
  release_year: number | null;
  genre: string | null;
  featured: boolean;
  status: "active" | "hidden";
  created_at: string;
};

export type Season = {
  id: number;
  series_id: number;
  season_number: number;
  title: string | null;
};

export type Episode = {
  id: number;
  season_id: number;
  episode_number: number;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  video_url: string | null;
  duration: number | null;
};

export type WatchProgress = {
  movie_id: number;
  progress_seconds: number;
  duration: number | null;
};
