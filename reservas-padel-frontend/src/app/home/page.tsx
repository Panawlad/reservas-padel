"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface Club {
  id: string;
  name: string;
  description: string;
  city: string;
  zone: string;
  courts: {
    id: string;
    name: string;
    surface: string;
    basePrice: number;
    isActive: boolean;
  }[];
}

export default function HomePage() {
  const router = useRouter();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  useEffect(() => {
    if (!token) {
      router.push("/auth");
      return;
    }

    const loadClubs = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/clubs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClubs(data);
      } catch (err) {
        console.error("Error cargando clubes:", err);
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando clubes...
      </div>
    );

  return (
    <main className="min-h-screen bg-black text-white p-6">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🏓 Reservas Pádel</h1>
        <button
          onClick={() => router.push("/reservations")}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
        >
          Mis reservas
        </button>
      </header>

      {/* LISTADO DE CLUBES */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <div
            key={club.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-md"
          >
            <h2 className="text-xl font-semibold mb-1">{club.name}</h2>
            <p className="text-sm text-zinc-400 mb-3">{club.description}</p>
            <p className="text-sm mb-2">
              📍 {club.city} — {club.zone}
            </p>

            <div className="mt-3 space-y-2">
              {club.courts.map((court) => (
                <div
                  key={court.id}
                  className="bg-zinc-800 p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{court.name}</p>
                    <p className="text-xs text-zinc-400">{court.surface}</p>
                  </div>
                  <button
                    onClick={() => router.push(`/courts/${court.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1 rounded-lg"
                  >
                    Ver horarios
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
