"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface Court {
  id: string;
  name: string;
  surface: string;
  basePrice: number;
  isActive: boolean;
  currency: string;
  indoor: boolean;
}

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
  courts: Court[];
  images: ClubImage[];
}

export default function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const resolvedParams = use(params);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  useEffect(() => {
    loadClubData();
  }, [resolvedParams.id]);

  const loadClubData = async () => {
    try {
      console.log("🔄 Cargando datos del club público:", resolvedParams.id);
      const { data } = await axios.get(`${API_URL}/clubs/public/${resolvedParams.id}`);
      console.log("📊 Datos del club público recibidos:", data);
      console.log("🖼️ Imágenes del club público:", data.images);
      setClub(data);
    } catch (err) {
      console.error("Error cargando datos del club:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (club?.images && club.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % club.images.length);
    }
  };

  const prevImage = () => {
    if (club?.images && club.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + club.images.length) % club.images.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Auto-play del carrusel (opcional)
  useEffect(() => {
    if (club?.images && club.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % club.images.length);
      }, 5000); // Cambiar imagen cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [club?.images]);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4">Cargando información del club...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Club no encontrado</h2>
          <p className="mb-6">El club que buscas no existe o no está disponible</p>
          <button
            onClick={() => router.push("/home")}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

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
              🏢 {club.name}
            </h1>
            <p className="text-lg text-white/80">
              {club.city} — {club.zone}
            </p>
          </div>
          <button
            onClick={() => router.push("/home")}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition-colors"
          >
            ← Volver
          </button>
        </div>
      </header>

      <div className="px-4 space-y-8">
        {/* Club Images Carousel */}
        {console.log("🔍 Verificando imágenes del club:", club?.images)}
        {console.log("🔍 Club existe:", !!club)}
        {console.log("🔍 Club images length:", club?.images?.length)}
        {club?.images && club.images.length > 0 ? (
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              📸 Galería del Club
            </h2>
            
            <div className="relative">
              {/* Main Image */}
              <div className="relative w-full h-96 rounded-xl overflow-hidden mb-4">
                <img
                  src={club.images[currentImageIndex]?.url}
                  alt={club.images[currentImageIndex]?.alt || `Imagen ${currentImageIndex + 1} de ${club.name}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {club.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      →
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {club.images.length}
                </div>
              </div>
              
              {/* Thumbnail Navigation */}
              {club.images.length > 1 && (
                <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                  {club.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => goToImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-white scale-110'
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Fallback cuando no hay imágenes */
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
            <div className="text-center text-white/60">
              <div className="text-6xl mb-4">📸</div>
              <p className="text-xl">No hay imágenes disponibles</p>
              <p className="text-sm">El club aún no ha subido imágenes</p>
            </div>
          </div>
        )}

        {/* Club Description */}
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Sobre {club.name}
            </h2>
            <p className="text-lg text-white/80 leading-relaxed max-w-4xl mx-auto">
              {club.description}
            </p>
          </div>
        </div>


        {/* Courts Section */}
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Nuestras Canchas
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {club.courts.map((court) => (
              <div
                key={court.id}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:bg-white/30 transition-all duration-300"
              >
                {/* Court Image Placeholder */}
                <div className="relative w-full h-48 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <div className="text-3xl mb-2">🏓</div>
                      <p className="text-sm">Imagen de {court.name}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-white mb-2">
                        {court.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                          {court.surface}
                        </span>
                        <span className="px-2 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                          {court.indoor ? 'Interior' : 'Exterior'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          court.isActive ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                        }`}>
                          {court.isActive ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold text-white mb-4">
                    ${(court.basePrice / 100).toFixed(2)}
                    <span className="text-sm font-normal text-white/70">/hora</span>
                  </div>
                  
                  {/* Solo mostrar información real proporcionada por el usuario */}
                  {court.amenities && court.amenities.length > 0 && (
                    <div className="space-y-2">
                      {court.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center justify-between text-sm text-white/70">
                          <span>{amenity.name}</span>
                          <span>✅ {amenity.included ? 'Incluido' : 'Disponible'}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => router.push(`/courts/${court.id}`)}
                    className="w-full mt-6 bg-white/20 backdrop-blur-sm text-white border border-white/30 py-3 font-semibold rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Ver Horarios Disponibles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
