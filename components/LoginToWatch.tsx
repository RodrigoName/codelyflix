import Link from "next/link";

export default function LoginToWatch({ redirectTo }: { redirectTo: string }) {
  return (
    <div className="aspect-video w-full bg-neutral-900 rounded flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="text-5xl">🔒</div>
      <div>
        <p className="text-lg font-semibold mb-1">Faça login para assistir</p>
        <p className="text-sm text-neutral-400">
          Você pode navegar pelo catálogo livremente, mas precisa de uma conta para dar play.
        </p>
      </div>
      <Link
        href={`/login?next=${encodeURIComponent(redirectTo)}`}
        className="bg-accent hover:bg-red-700 transition-colors px-6 py-2.5 rounded font-medium"
      >
        Entrar ou criar conta
      </Link>
    </div>
  );
}
