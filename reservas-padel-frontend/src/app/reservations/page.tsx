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

  if (loading) return <p className="text-center text-gray-400">Cargando reservas…</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Mis Reservas</h1>

      {reservations.length === 0 && <p>No tienes reservas registradas.</p>}

      {reservations.map((r) => (
        <div
          key={r.id}
          className="bg-zinc-800 p-6 rounded-xl mb-4 flex justify-between"
        >
          <div>
            <p className="font-semibold text-xl">{r.court.name}</p>
            <p className="text-sm text-gray-400">
              {r.timeslot.startTime} – {r.timeslot.endTime}
            </p>
            <p className="mt-2 text-green-400 font-medium">{r.status}</p>
          </div>

          {r.status === "PENDING" && (
            <PayUSDCButton reservationId={r.id} token={token} />
          )}
        </div>
      ))}
    </div>
  );
}
