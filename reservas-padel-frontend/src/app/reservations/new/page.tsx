"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface Reservation {
  id: string;
  status: string;
  totalCents: number;
  currency: string;
  timeslot: {
    startTime: string;
    endTime: string;
  };
  court: {
    name: string;
    club: { name: string };
  };
}

export default function NewReservationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const timeslotId = params.get("timeslot");

  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("FIAT"); // o "USDC"

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  useEffect(() => {
    if (!token || !timeslotId) {
      router.push("/auth");
      return;
    }
    setLoading(false);
  }, [token, timeslotId, router]);

  const handleReserve = async () => {
    try {
      setLoading(true);
      
      // Crear la reserva
      const { data } = await axios.post(
        `${API_URL}/reservations/create`,
        { timeslotId, paymentMethod: method },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirigir a la página de pago
      router.push(`/payment?reservationId=${data.reservation.id}&method=${method}`);
      
    } catch (err: any) {
      console.error("Error creando reserva:", err);
      const errorMessage = err.response?.data?.error || "Error creando la reserva. Verifica tu sesión o disponibilidad.";
      alert(errorMessage);
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--beige-600)' }}></div>
          <p className="mt-4" style={{ color: 'var(--dark-brown)' }}>Procesando reserva...</p>
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--dark-brown)' }}>
            Confirmar Reserva
          </h1>
          <p className="text-sm" style={{ color: 'var(--beige-600)' }}>
            Selecciona tu método de pago preferido
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={() => setMethod("FIAT")}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              method === "FIAT" 
                ? "beige-success" 
                : "beige-input hover:bg-beige-200"
            }`}
          >
            💳 Pago normal (Tarjeta / Efectivo)
          </button>
          <button
            onClick={() => setMethod("USDC")}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              method === "USDC" 
                ? "beige-success" 
                : "beige-input hover:bg-beige-200"
            }`}
          >
            💰 Pago con USDC (Crypto)
          </button>
        </div>

        <button
          onClick={handleReserve}
          className="w-full py-4 rounded-xl beige-button font-semibold text-lg transition-all duration-300 hover:scale-105"
        >
          ✨ Confirmar reserva
        </button>

        <button
          onClick={() => router.push("/home")}
          className="mt-6 w-full text-sm transition-colors duration-300"
          style={{ color: 'var(--beige-600)' }}
          onMouseEnter={(e) => e.target.style.color = 'var(--dark-brown)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--beige-600)'}
        >
          ← Volver
        </button>
      </div>
    </main>
  );
}
