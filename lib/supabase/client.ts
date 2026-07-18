import { createBrowserClient } from "@supabase/ssr";

// Usar dentro de componentes "use client" — gerencia sessão via cookies
// automaticamente, para o middleware conseguir ler quem está logado.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}
