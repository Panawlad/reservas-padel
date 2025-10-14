"use client";

import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-800">
        <h1 className="text-3xl font-bold mb-2">reservas-pádel</h1>
        <p className="text-zinc-400 mb-6">
          Conecta tu wallet o inicia sesión para acceder a tus reservas.
        </p>

        <div className="flex items-center gap-3 mb-6">
          <WalletMultiButton />
          <span className="text-sm text-zinc-500">Red: <b>devnet</b></span>
        </div>

        <div className="space-y-3">
          <Link href="/auth" className="block text-center w-full rounded-xl px-4 py-3 bg-blue-600 hover:bg-blue-700 font-semibold">
            Iniciar sesión / Registrarme
          </Link>

          <Link href="/reservations" className="block text-center w-full rounded-xl px-4 py-3 bg-green-600 hover:bg-green-700 font-semibold">
            Ir a mis reservas
          </Link>
        </div>

        <hr className="my-6 border-zinc-800" />
        <p className="text-xs text-zinc-500 text-center">
          API: <code>{process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}</code>
        </p>
      </div>
    </main>
  );
}
