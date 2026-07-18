-- =========================================================
-- CodelyFlix — Schema completo (Supabase / PostgreSQL)
-- =========================================================

create extension if not exists pgcrypto;

-- FILMES
create table if not exists movies (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  poster text,
  banner text,
  category text,
  trailer_url text,
  director text,
  cast_members text[],
  duration integer,
  language text default 'Português',
  age_rating text,
  country text,
  release_year integer,
  featured boolean default false,
  status text default 'active', -- active | hidden
  premium boolean default false,
  created_at timestamp default now()
);

create index if not exists movies_search
  on movies using gin (to_tsvector('portuguese', coalesce(title,'') || ' ' || coalesce(description,'')));

-- SÉRIES
create table if not exists series (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  poster text,
  banner text,
  release_year integer,
  genre text,
  featured boolean default false,
  status text default 'active',
  created_at timestamp default now()
);

-- TEMPORADAS
create table if not exists seasons (
  id bigint generated always as identity primary key,
  series_id bigint references series(id) on delete cascade,
  season_number integer not null,
  title text
);

-- EPISÓDIOS
create table if not exists episodes (
  id bigint generated always as identity primary key,
  season_id bigint references seasons(id) on delete cascade,
  episode_number integer not null,
  title text,
  description text,
  thumbnail text,
  video_url text,
  duration integer
);

-- FONTES DE VÍDEO (multi-qualidade)
create table if not exists video_sources (
  id bigint generated always as identity primary key,
  movie_id bigint references movies(id) on delete cascade,
  quality text, -- 480p | 720p | 1080p
  language text default 'pt-BR',
  video_url text,
  created_at timestamp default now()
);

-- LEGENDAS
create table if not exists subtitles (
  id bigint generated always as identity primary key,
  movie_id bigint references movies(id) on delete cascade,
  language text,
  label text,
  file_url text
);

-- FAVORITOS
create table if not exists favorites (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  movie_id bigint references movies(id) on delete cascade,
  created_at timestamp default now(),
  unique (user_id, movie_id)
);

-- HISTÓRICO
create table if not exists watch_history (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  movie_id bigint references movies(id) on delete cascade,
  watched_at timestamp default now()
);

-- PROGRESSO ("continuar assistindo")
create table if not exists watch_progress (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  movie_id bigint references movies(id) on delete cascade,
  progress_seconds integer default 0,
  duration integer,
  updated_at timestamp default now(),
  unique (user_id, movie_id)
);

-- ASSINATURAS (opcional / plano premium)
create table if not exists subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  plan text default 'free', -- free | premium
  status text default 'active',
  started_at timestamp default now(),
  expires_at timestamp
);

-- PERFIS DE USUÁRIO (papel: user | admin)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  role text default 'user', -- user | admin
  avatar_url text,
  created_at timestamp default now()
);

-- =========================================================
-- Cria automaticamente um perfil (role = 'user') sempre que
-- alguém se cadastra (email/senha, Google ou GitHub).
-- =========================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================
-- RLS (Row Level Security) — cada usuário só vê seus dados
-- =========================================================
alter table favorites enable row level security;
alter table watch_history enable row level security;
alter table watch_progress enable row level security;
alter table profiles enable row level security;

drop policy if exists "usuario ve seus favoritos" on favorites;
create policy "usuario ve seus favoritos" on favorites
  for all using (auth.uid() = user_id);

drop policy if exists "usuario ve seu historico" on watch_history;
create policy "usuario ve seu historico" on watch_history
  for all using (auth.uid() = user_id);

drop policy if exists "usuario ve seu progresso" on watch_progress;
create policy "usuario ve seu progresso" on watch_progress
  for all using (auth.uid() = user_id);

drop policy if exists "usuario ve seu perfil" on profiles;
create policy "usuario ve seu perfil" on profiles
  for all using (auth.uid() = id);

-- Catálogo (filmes/séries) é público para leitura
alter table movies enable row level security;
alter table series enable row level security;
alter table seasons enable row level security;
alter table episodes enable row level security;

drop policy if exists "catalogo publico filmes" on movies;
create policy "catalogo publico filmes" on movies for select using (status = 'active');

drop policy if exists "catalogo publico series" on series;
create policy "catalogo publico series" on series for select using (status = 'active');

drop policy if exists "catalogo publico temporadas" on seasons;
create policy "catalogo publico temporadas" on seasons for select using (true);

drop policy if exists "catalogo publico episodios" on episodes;
create policy "catalogo publico episodios" on episodes for select using (true);
