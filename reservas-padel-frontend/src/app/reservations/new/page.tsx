"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import QRCode from "react-qr-code";

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
  const [success, setSuccess] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [method, setMethod] = useState("FIAT"); // o "USDC"
  const [qrData, setQrData] = useState<string | null>(null);

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
      const { data } = await axios.post(
        `${API_URL}/reservations/create`,
        { timeslotId, paymentMethod: method },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReservation(data.reservation);
      setSuccess(true);

      // 🔹 Simulación: generar QR de confirmación
      setQrData(
        JSON.stringify({
          id: data.reservation.id,
          court: data.reservation.court.name,
          club: data.reservation.court.club.name,
          start: data.reservation.timeslot.startTime,
          end: data.reservation.timeslot.endTime,
          status: "PENDING",
        })
      );
    } catch (err) {
      console.error("Error creando reserva:", err);
      alert("Error creando la reserva. Verifica tu sesión o disponibilidad.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Procesando reserva...
      </div>
    );

  if (success && reservation)
    return (
      <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">✅ Reserva creada</h1>
        <p className="mb-2">
          {reservation.court.club.name} — {reservation.court.name}
        </p>
        <p className="mb-4">
          {reservation.timeslot.startTime} - {reservation.timeslot.endTime}
        </p>
        <p className="text-green-400 mb-4">
          Monto: ${(reservation.totalCents / 100).toFixed(2)}{" "}
          {reservation.currency}
        </p>

        {qrData && (
          <div className="bg-white p-4 rounded-lg">
            <QRCode value={qrData} size={180} />
          </div>
        )}

        <button
          onClick={() => router.push("/reservations/my")}
          className="mt-6 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
        >
          Ver mis reservas
        </button>
      </main>
    );

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Confirmar Reserva</h1>

      <p className="text-gray-400 mb-4">Selecciona tu método de pago:</p>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMethod("FIAT")}
          className={`px-4 py-2 rounded-lg ${
            method === "FIAT" ? "bg-green-600" : "bg-zinc-800"
          }`}
        >
          Pago normal (Tarjeta / Efectivo)
        </button>
        <button
          onClick={() => setMethod("USDC")}
          className={`px-4 py-2 rounded-lg ${
            method === "USDC" ? "bg-green-600" : "bg-zinc-800"
          }`}
        >
          Pago con USDC
        </button>
      </div>

      <button
        onClick={handleReserve}
        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg"
      >
        Confirmar reserva
      </button>

      <button
        onClick={() => router.push("/home")}
        className="mt-6 text-sm text-gray-400 hover:text-white"
      >
        ← Volver
      </button>
    </main>
  );
}
