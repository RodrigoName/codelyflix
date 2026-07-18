import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Cliente público (respeita RLS) — usar no browser e em rotas normais
export const supabase = createClient(url, anonKey);

// Cliente com privilégios de admin — usar SOMENTE em API routes server-side,
// nunca no browser (a service role key ignora o RLS).
export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
