"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface TimeslotInfo {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  priceCents: number;
  currency: string;
  status: string;
  court: {
    id: string;
    name: string;
    surface: string;
    indoor: boolean;
    club: {
      id: string;
      name: string;
      city: string;
      zone: string;
    };
  };
}


function NewReservationPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const timeslotId = params.get("timeslot");

  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [method, setMethod] = useState("FIAT");
  const [timeslotInfo, setTimeslotInfo] = useState<TimeslotInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  const loadTimeslotInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.get(`${API_URL}/timeslots/${timeslotId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.status !== 'AVAILABLE') {
        setError('Este horario ya no está disponible');
        setTimeout(() => router.push('/home'), 2000);
        return;
      }
      
      setTimeslotInfo(data);
    } catch (err: unknown) {
      console.error('Error cargando horario:', err);
      setError('Error cargando información del horario');
      setTimeout(() => router.push('/home'), 2000);
    } finally {
      setLoading(false);
    }
  }, [timeslotId, token, router]);

  useEffect(() => {
    if (!token || !timeslotId) {
      router.push("/auth");
      return;
    }
    
    loadTimeslotInfo();
  }, [token, timeslotId, router, loadTimeslotInfo]);

  const handleReserve = async () => {
    if (!timeslotInfo) {
      setError('Información del horario no disponible');
      return;
    }
    
    if (timeslotInfo.status !== 'AVAILABLE') {
      setError('Este horario ya no está disponible');
      setTimeout(() => router.push('/home'), 2000);
      return;
    }

    try {
      setReserving(true);
      setError(null);

      const { data } = await axios.post(
        `${API_URL}/reservations/create`,
        { timeslotId, paymentMethod: method },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.push(`/payment?reservationId=${data.reservation.id}&method=${method}`);
    } catch (err: unknown) {
      console.error("Error creando reserva:", err);

      let errorMessage = "Error creando la reserva. Verifica tu sesión o disponibilidad.";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setReserving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: "var(--beige-600)" }}
          ></div>
          <p className="mt-4" style={{ color: "var(--dark-brown)" }}>
            Cargando información del horario...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--dark-brown)" }}>
            Error
          </h2>
          <p className="mb-6" style={{ color: "var(--beige-600)" }}>
            {error}
          </p>
          <button
            onClick={() => router.push('/home')}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Volver a Clubes
          </button>
        </div>
      </div>
    );

  return (
    <main className="min-h-screen p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full beige-card p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-4">
            <span className="text-xl">🏓</span>
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--dark-brown)" }}
          >
            Confirmar Reserva
          </h1>
          <p className="text-sm" style={{ color: "var(--beige-600)" }}>
            Selecciona tu método de pago preferido
          </p>
        </div>

        {/* Información de la reserva */}
        {timeslotInfo && (
          <div className="bg-white/10 rounded-xl p-4 mb-6">
            <h3 className="font-semibold mb-3" style={{ color: "var(--dark-brown)" }}>
              📋 Detalles de la reserva
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--beige-600)" }}>Club:</span>
                <span style={{ color: "var(--dark-brown)" }}>{timeslotInfo.court.club.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--beige-600)" }}>Cancha:</span>
                <span style={{ color: "var(--dark-brown)" }}>{timeslotInfo.court.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--beige-600)" }}>Superficie:</span>
                <span style={{ color: "var(--dark-brown)" }}>{timeslotInfo.court.surface}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--beige-600)" }}>Tipo:</span>
                <span style={{ color: "var(--dark-brown)" }}>
                  {timeslotInfo.court.indoor ? "🏠 Interior" : "🌤️ Exterior"}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--beige-600)" }}>Horario:</span>
                <span style={{ color: "var(--dark-brown)" }}>
                  {timeslotInfo.startTime} - {timeslotInfo.endTime}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-white/20">
                <span style={{ color: "var(--beige-600)" }}>Precio:</span>
                <span style={{ color: "var(--dark-brown)" }}>
                  ${(timeslotInfo.priceCents / 100).toFixed(2)} {timeslotInfo.currency}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Métodos de pago */}
        <div className="space-y-4 mb-6">
          <button
            onClick={() => setMethod("FIAT")}
            disabled={reserving}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              method === "FIAT" 
                ? "beige-success" 
                : "beige-input hover:bg-beige-200 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            💳 Pago normal (Tarjeta / Efectivo)
          </button>
          <button
            onClick={() => setMethod("USDC")}
            disabled={reserving}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              method === "USDC" 
                ? "beige-success" 
                : "beige-input hover:bg-beige-200 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            💰 Pago con USDC (Crypto)
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Botón de confirmación */}
        <button
          onClick={handleReserve}
          disabled={reserving || !timeslotInfo}
          className="w-full py-4 rounded-xl beige-button font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {reserving ? '⏳ Procesando...' : '✨ Confirmar reserva'}
        </button>

        <button
          onClick={() => router.push("/home")}
          disabled={reserving}
          className="mt-6 w-full text-sm transition-colors duration-300 disabled:opacity-50"
          style={{ color: "var(--beige-600)" }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (!reserving) {
              e.currentTarget.style.color = "var(--dark-brown)";
            }
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.color = "var(--beige-600)";
          }}
        >
          ← Volver
        </button>
      </div>
    </main>
  );
}

// ✅ Envolvemos en Suspense para evitar error en build con useSearchParams
export default function NewReservationPage() {
  return (
    <Suspense fallback={<div className="text-center text-white mt-10">Cargando...</div>}>
      <NewReservationPageContent />
    </Suspense>
  );
}
