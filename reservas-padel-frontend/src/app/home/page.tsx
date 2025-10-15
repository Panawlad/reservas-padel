"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface ClubImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  orderIndex: number;
}

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
  images: ClubImage[];
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
        console.log("🔄 Cargando clubes disponibles...");
        const { data } = await axios.get(`${API_URL}/clubs/public`);
        console.log("📊 Clubes recibidos:", data);
        console.log("🔢 Cantidad de clubes:", data.length);
        console.log("🖼️ Imágenes del primer club:", data[0]?.images);
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
      <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--dark-brown)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--beige-600)' }}></div>
          <p className="mt-4">Cargando clubes...</p>
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
      <header className="w-full px-4 pt-6 mb-8">
        <div className="backdrop-blur-sm bg-white/20 border border-white/30 rounded-2xl px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">
                🏓 Clubes Disponibles
              </h1>
              <p className="text-lg text-white/80">
                Encuentra tu club favorito y reserva tu cancha
              </p>
            </div>
            <button
              onClick={() => router.push("/reservations")}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition-colors"
            >
              📅 Mis reservas
            </button>
          </div>
          
          {/* Filtros de búsqueda */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Ciudad</label>
              <select
                className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30"
                onChange={(e) => {
                  // Filtrar clubes por ciudad
                  console.log("Filtrar por ciudad:", e.target.value);
                }}
              >
                <option value="">Todas las ciudades</option>
                <option value="Ciudad de México">Ciudad de México</option>
                <option value="Guadalajara">Guadalajara</option>
                <option value="Monterrey">Monterrey</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-semibold mb-2">Zona</label>
              <select
                className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30"
                onChange={(e) => {
                  // Filtrar clubes por zona
                  console.log("Filtrar por zona:", e.target.value);
                }}
              >
                <option value="">Todas las zonas</option>
                <option value="Del Valle">Del Valle</option>
                <option value="Polanco">Polanco</option>
                <option value="Santa Fe">Santa Fe</option>
                <option value="Roma">Roma</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-semibold mb-2">Precio Máximo</label>
              <select
                className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30"
                onChange={(e) => {
                  // Filtrar clubes por precio
                  console.log("Filtrar por precio:", e.target.value);
                }}
              >
                <option value="">Cualquier precio</option>
                <option value="500">Hasta $500/hora</option>
                <option value="800">Hasta $800/hora</option>
                <option value="1000">Hasta $1000/hora</option>
                <option value="1500">Hasta $1500/hora</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* LISTADO DE CLUBES */}
      <section className="px-4 space-y-8">
        {clubs.map((club) => (
          <div
            key={club.id}
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8 hover:bg-white/30 transition-all duration-300"
          >
            {/* Club Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white text-xl">🏢</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      {club.name}
                    </h2>
                    <p className="text-white/80">
                      {club.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-1">
                    📍 {club.city} — {club.zone}
                  </span>
                  <span className="flex items-center gap-1">
                    🏓 {club.courts.length} cancha{club.courts.length !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    ⭐ 4.8/5
                  </span>
                </div>
              </div>
            </div>

            {/* Club Image Gallery */}
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
              {/* Club Images */}
              {club.images && club.images.length > 0 ? (
                <div className="relative w-full h-64 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden mb-6">
                  <img
                    src={club.images[0].url}
                    alt={club.images[0].alt || `Imagen de ${club.name}`}
                    className="w-full h-full object-cover"
                  />
                  {club.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                      +{club.images.length - 1} más
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full h-64 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <div className="text-4xl mb-2">🏓</div>
                      <p className="text-lg">Imágenes del club</p>
                      <p className="text-sm">(Slider de imágenes aquí)</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Button */}
              <div className="text-center">
                <button
                  onClick={() => router.push(`/club/${club.id}`)}
                  className="inline-block bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Ver Horarios Disponibles
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
