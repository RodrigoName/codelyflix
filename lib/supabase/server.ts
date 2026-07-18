import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Usar dentro de Server Components / Route Handlers — lê a sessão
// a partir dos cookies da requisição (o mesmo que o middleware grava).
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Ignora: em Server Components puros não é possível gravar cookies.
            // Quem grava de fato é o middleware.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // idem acima
          }
        },
      },
    }
  );
}

// Retorna o usuário logado (ou null) — helper de conveniência para as páginas.
export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Retorna o perfil (com role) do usuário logado, ou null.
export async function getCurrentProfile() {
  const supabase = createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}
