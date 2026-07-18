"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function loginWithProvider(provider: "google" | "github") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("E-mail ou senha inválidos.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("already registered")) {
        setError("Esse e-mail já tem cadastro. Tente fazer login.");
      } else {
        setError("Não foi possível criar a conta: " + error.message);
      }
      return;
    }

    // Se a confirmação de e-mail estiver ativada no Supabase, não existe sessão
    // ainda — o usuário precisa clicar no link recebido por e-mail.
    if (data.session) {
      router.push("/");
      router.refresh();
    } else {
      setInfo("Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar.");
      setMode("login");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-base px-4">
      <div className="w-full max-w-sm bg-surface p-8 rounded">
        <h1 className="font-display text-3xl text-accent mb-2 text-center">CODELYFLIX</h1>
        <p className="text-center text-sm text-neutral-400 mb-6">
          {mode === "login" ? "Entre na sua conta" : "Crie sua conta gratuita"}
        </p>

        <form
          onSubmit={mode === "login" ? handleLogin : handleSignup}
          className="flex flex-col gap-3 mb-4"
        >
          {mode === "signup" && (
            <input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/40 border border-neutral-700 rounded px-3 py-2 text-sm"
              required
            />
          )}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/40 border border-neutral-700 rounded px-3 py-2 text-sm"
            required
          />
          <input
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black/40 border border-neutral-700 rounded px-3 py-2 text-sm"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {info && <p className="text-green-500 text-sm">{info}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-red-700 transition-colors rounded py-2 font-semibold disabled:opacity-50"
          >
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
            setInfo("");
          }}
          className="text-sm text-neutral-400 hover:text-white w-full text-center mb-6"
        >
          {mode === "login" ? (
            <>Não tem conta? <span className="text-accent">Cadastre-se</span></>
          ) : (
            <>Já tem conta? <span className="text-accent">Entrar</span></>
          )}
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="h-px bg-neutral-700 flex-1" />
          <span className="text-xs text-neutral-500">ou</span>
          <div className="h-px bg-neutral-700 flex-1" />
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => loginWithProvider("google")}
            className="bg-white text-black rounded py-2 text-sm font-medium hover:bg-neutral-200"
          >
            Continuar com Google
          </button>
          <button
            onClick={() => loginWithProvider("github")}
            className="bg-neutral-800 rounded py-2 text-sm font-medium hover:bg-neutral-700"
          >
            Continuar com GitHub
          </button>
        </div>
      </div>
    </main>
  );
}
