"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/api";

export default function ClubDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  useEffect(() => {
    const check = async () => {
      if (!token) { router.push("/auth"); return; }
      try {
        const me = await getProfile(token);
        if (me.role !== "CLUB" && me.role !== "ADMIN") { router.push("/home"); return; }
        setAllowed(true);
      } finally { setLoading(false); }
    };
    check();
  }, [token, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando…</div>;
  if (!allowed) return null;

  return (
    <main className="min-h-screen p-6">
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--dark-brown)' }}>Panel del Club</h1>
        <span style={{ color: 'var(--beige-700)' }}>Rol: CLUB</span>
      </header>

      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {[
          { title: 'Mis Canchas', icon: '🎾', hint: 'Crear y editar canchas' },
          { title: 'Horarios', icon: '⏰', hint: 'Configurar disponibilidad' },
          { title: 'Reservas', icon: '📅', hint: 'Ver y confirmar pagos' },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl p-6 hover:shadow-xl transition"
            style={{ background: 'linear-gradient(135deg, var(--warm-white), var(--beige-50))', border: '1px solid var(--beige-200)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)' }}>{c.icon}</div>
            <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>{c.title}</h3>
            <p style={{ color: 'var(--beige-700)' }}>{c.hint}</p>
          </div>
        ))}
      </section>
    </main>
  );
}


