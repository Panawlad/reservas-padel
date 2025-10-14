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
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando cancha...
      </div>
    );

  if (!court)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Cancha no encontrada.
      </div>
    );

  return (
    <main className="min-h-screen bg-black text-white p-6">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {court.club.name} - {court.name}
        </h1>
        <button
          onClick={() => router.push("/home")}
          className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
        >
          ← Volver
        </button>
      </header>

      {/* HORARIOS */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timeslots.length > 0 ? (
          timeslots.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-lg transition ${
                t.status === "AVAILABLE"
                  ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                  : "bg-zinc-800 opacity-50 cursor-not-allowed"
              }`}
              onClick={() =>
                t.status === "AVAILABLE"
                  ? router.push(`/reservations/new?timeslot=${t.id}`)
                  : null
              }
            >
              <p className="font-semibold">
                {t.startTime} - {t.endTime}
              </p>
              <p className="text-sm text-zinc-300">
                Precio: ${(t.priceCents / 100).toFixed(2)} {t.currency}
              </p>
              <p className="text-xs mt-1">
                Estado:{" "}
                <span
                  className={
                    t.status === "AVAILABLE"
                      ? "text-green-300"
                      : "text-red-400"
                  }
                >
                  {t.status}
                </span>
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400">
            No hay horarios disponibles para esta cancha.
          </div>
        )}
      </section>
    </main>
  );
}
