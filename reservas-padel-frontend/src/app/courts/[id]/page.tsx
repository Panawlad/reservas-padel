"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface Timeslot {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  priceCents: number;
  currency: string;
}

interface Court {
  id: string;
  name: string;
  surface: string;
  club: {
    id: string;
    name: string;
  };
}

export default function CourtPage() {
  const router = useRouter();
  const { id } = useParams();
  const [court, setCourt] = useState<Court | null>(null);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  useEffect(() => {
    if (!token) {
      router.push("/auth");
      return;
    }

    const loadCourtData = async () => {
      try {
        // 1️⃣ Obtener información de la cancha
        const { data: courtData } = await axios.get(`${API_URL}/courts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourt(courtData);

        // 2️⃣ Obtener horarios por cancha
        const { data: timeslotData } = await axios.get(
          `${API_URL}/timeslots/court/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // ✅ Asegurar que sea un array
        if (Array.isArray(timeslotData)) {
          setTimeslots(timeslotData);
        } else if (Array.isArray(timeslotData.timeslots)) {
          setTimeslots(timeslotData.timeslots);
        } else {
          setTimeslots([]);
        }
      } catch (err) {
        console.error("Error cargando cancha o horarios:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourtData();
  }, [id, token, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--beige-600)' }}></div>
          <p className="mt-4" style={{ color: 'var(--dark-brown)' }}>Cargando cancha...</p>
        </div>
      </div>
    );

  if (!court)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--dark-brown)' }}>
            Cancha no encontrada
          </h3>
          <p style={{ color: 'var(--beige-600)' }}>
            La cancha que buscas no existe o no está disponible
          </p>
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

      {/* HEADER */}
      <header className="px-4 pt-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-xl">🏓</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  {court.name}
                </h1>
                <p className="text-lg text-white/80">
                  {court.club.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-white/70 mb-4">
              <span className="flex items-center gap-1">
                <span className="px-2 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                  {court.surface}
                </span>
              </span>
              <span className="flex items-center gap-1">
                💡 Iluminación LED
              </span>
              <span className="flex items-center gap-1">
                🚿 Vestuarios
              </span>
              <span className="flex items-center gap-1">
                🅿️ Parking gratuito
              </span>
            </div>
          </div>
          
          <button
            onClick={() => router.push("/home")}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition-colors"
          >
            ← Volver
          </button>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-2">
            Selecciona tu horario preferido
          </h2>
          <p className="text-white/80">
            Haz clic en cualquier horario disponible para proceder con tu reserva
          </p>
        </div>
      </header>

      {/* HORARIOS */}
      <section className="px-4 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {timeslots.length > 0 ? (
          timeslots.map((t) => (
            <div
              key={t.id}
              className={`bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center transition-all duration-300 ${
                t.status === "AVAILABLE"
                  ? "cursor-pointer hover:bg-white/30 hover:shadow-lg"
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={() =>
                t.status === "AVAILABLE"
                  ? router.push(`/reservations/new?timeslot=${t.id}`)
                  : null
              }
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                style={t.status === "AVAILABLE" ? {
                  background: 'linear-gradient(135deg, var(--emerald-500) 0%, var(--emerald-600) 100%)'
                } : {
                  background: 'rgba(255, 255, 255, 0.2)'
                }}
              >
                <span className="text-white text-2xl">
                  {t.status === "AVAILABLE" ? "✓" : "✗"}
                </span>
              </div>
              
              <h3 className="font-bold text-xl mb-2 text-white">
                {t.startTime} - {t.endTime}
              </h3>
              
              <div className="text-2xl font-bold mb-4 text-white">
                ${(t.priceCents / 100).toFixed(2)}
                <span className="text-sm font-normal text-white/70">/hora</span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>⏱️ 1 hora</span>
                  <span>👥 4 jugadores</span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>💳 Pago seguro</span>
                  <span>📱 QR incluido</span>
                </div>
              </div>
              
              <span 
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  t.status === "AVAILABLE"
                    ? "bg-emerald-500 text-white"
                    : "bg-red-500/20 text-red-200"
                }`}
              >
                {t.status === "AVAILABLE" ? "Reservar ahora" : "No disponible"}
              </span>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-12 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-amber-500/20 backdrop-blur-sm flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">⏰</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                No hay horarios disponibles
              </h3>
              <p className="text-white/80 mb-6">
                Esta cancha no tiene horarios disponibles en este momento
              </p>
              <button
                onClick={() => router.push("/home")}
                className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                Ver Otras Canchas
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
