"use client";

import { useEffect, useState } from "react";
import PayUSDCButton from "@/components/PayUSDCButton";
import { getReservations } from "@/lib/api";
import type { Reservation } from "@/types/reservation";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const data = await getReservations(token);
        setReservations(data);
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--beige-600)' }}></div>
        <p className="mt-4" style={{ color: 'var(--beige-600)' }}>Cargando reservas…</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
      {/* Background decorative elements */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px 600px at -10% -20%, rgba(255, 255, 255, 0.1), transparent 60%), radial-gradient(900px 500px at 110% 10%, rgba(255, 255, 255, 0.1), transparent 60%)',
        }}
      />

      {/* Header */}
      <header className="w-full px-4 pt-6 mb-8">
        <div className="flex justify-between items-center backdrop-blur-sm bg-white/20 border border-white/30 rounded-2xl px-6 py-4">
          <div>
            <h1 className="text-4xl font-bold text-white">
              📅 Mis Reservas
            </h1>
            <p className="text-lg text-white/80">
              Gestiona y controla todas tus reservas de pádel
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition-colors"
          >
            ← Volver
          </button>
        </div>
      </header>

      <div className="px-4">

        {reservations.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-12 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-amber-500/20 backdrop-blur-sm flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                No tienes reservas registradas
              </h3>
              <p className="text-white/80 mb-6">
                Explora los clubes disponibles y haz tu primera reserva
              </p>
              <a 
                href="/home" 
                className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-lg font-semibold inline-block hover:bg-white/30 transition-colors"
              >
                Explorar Clubes
              </a>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {reservations.map((r) => (
            <div
              key={r.id}
              className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:bg-white/30 transition-all duration-300"
            >
              {/* Club Overview Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-xl">🏢</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white">
                    {r.court.club.name}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {r.court.name}
                  </p>
                </div>
                <span 
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    r.status === 'PENDING' ? 'bg-amber-500/20 text-amber-200' :
                    r.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-200' :
                    'bg-red-500/20 text-red-200'
                  }`}
                >
                  {r.status === 'PENDING' ? '⏳ Pendiente' :
                   r.status === 'PAID' ? '✅ Pagada' :
                   '❌ Cancelada'}
                </span>
              </div>

              {/* Reservation Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Horario:</span>
                  <span className="text-white font-medium">
                    {r.timeslot.startTime} – {r.timeslot.endTime}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Precio:</span>
                  <span className="text-white font-bold text-lg">
                    ${(r.totalCents / 100).toFixed(2)} {r.currency}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {r.status === "PENDING" && (
                <div className="pt-4 border-t border-white/20">
                  <PayUSDCButton reservationId={r.id} token={token} />
                </div>
              )}

              {r.status === "PAID" && (
                <div className="pt-4 border-t border-white/20">
                  <div className="text-center">
                    <p className="text-white/80 text-sm mb-2">Reserva confirmada</p>
                    <div className="w-full h-2 bg-emerald-500/20 rounded-full">
                      <div className="w-full h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
