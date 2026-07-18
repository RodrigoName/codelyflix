import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente com privilégios de admin — usar SOMENTE em API routes server-side,
// nunca no browser (a service role/secret key ignora o RLS).
export function supabaseAdmin() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
