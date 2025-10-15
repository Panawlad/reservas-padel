"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProtectedRoute from "../../components/ProtectedRoute";

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

interface Club {
  id: string;
  name: string;
  description: string;
  city: string;
  zone: string;
  courts: Court[];
}

function ClubAdminPage() {
  const router = useRouter();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [showAddCourt, setShowAddCourt] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  useEffect(() => {
    if (!token) {
      router.push("/auth");
      return;
    }

    loadClubData();
  }, [token, router]);

  const loadClubData = async () => {
    try {
      // Obtener el club del usuario actual
      const { data } = await axios.get(`${API_URL}/clubs/my-club`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClub(data);
    } catch (err) {
      console.error("Error cargando datos del club:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClub = async (updatedData: Partial<Club>) => {
    try {
      await axios.put(`${API_URL}/clubs/${club?.id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClub({ ...club!, ...updatedData });
      alert("Club actualizado exitosamente");
    } catch (err) {
      console.error("Error actualizando club:", err);
      alert("Error al actualizar el club");
    }
  };

  const handleUpdateCourt = async (courtId: string, updatedData: Partial<Court>) => {
    try {
      await axios.put(`${API_URL}/courts/${courtId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClub({
        ...club!,
        courts: club!.courts.map(c => c.id === courtId ? { ...c, ...updatedData } : c)
      });
      setEditingCourt(null);
      alert("Cancha actualizada exitosamente");
    } catch (err) {
      console.error("Error actualizando cancha:", err);
      alert("Error al actualizar la cancha");
    }
  };

  const handleAddCourt = async (courtData: Omit<Court, 'id'>) => {
    try {
      const { data } = await axios.post(`${API_URL}/courts`, {
        ...courtData,
        clubId: club?.id
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClub({
        ...club!,
        courts: [...club!.courts, data]
      });
      setShowAddCourt(false);
      alert("Cancha agregada exitosamente");
    } catch (err) {
      console.error("Error agregando cancha:", err);
      alert("Error al agregar la cancha");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4">Cargando datos del club...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No tienes un club registrado</h2>
          <p className="mb-6">Contacta al administrador para registrar tu club</p>
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
              🏢 Administración del Club
            </h1>
            <p className="text-lg text-white/80">
              Gestiona la información y canchas de tu club
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
        {/* Club Information */}
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Información del Club</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">Nombre del Club</label>
              <input
                type="text"
                value={club.name}
                onChange={(e) => setClub({...club, name: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                placeholder="Nombre del club"
              />
            </div>
            
            <div>
              <label className="block text-white font-semibold mb-2">Ciudad</label>
              <input
                type="text"
                value={club.city}
                onChange={(e) => setClub({...club, city: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                placeholder="Ciudad"
              />
            </div>
            
            <div>
              <label className="block text-white font-semibold mb-2">Zona</label>
              <input
                type="text"
                value={club.zone}
                onChange={(e) => setClub({...club, zone: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                placeholder="Zona"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-white font-semibold mb-2">Descripción</label>
              <textarea
                value={club.description}
                onChange={(e) => setClub({...club, description: e.target.value})}
                rows={3}
                className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50 resize-none"
                placeholder="Descripción del club"
              />
            </div>
          </div>
          
          <button
            onClick={() => handleUpdateClub(club)}
            className="mt-6 px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition-colors"
          >
            Guardar Cambios del Club
          </button>
        </div>

        {/* Courts Management */}
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Gestión de Canchas</h2>
            <button
              onClick={() => setShowAddCourt(true)}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition-colors"
            >
              + Agregar Cancha
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {club.courts.map((court) => (
              <div key={court.id} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{court.name}</h3>
                  <button
                    onClick={() => setEditingCourt(court)}
                    className="text-white/70 hover:text-white"
                  >
                    ✏️
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span>Superficie:</span>
                    <span className="px-2 py-1 bg-white/20 rounded-full text-xs">{court.surface}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span>Precio:</span>
                    <span className="font-semibold">${(court.basePrice / 100).toFixed(2)}/hora</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span>Tipo:</span>
                    <span>{court.indoor ? 'Interior' : 'Exterior'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span>Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      court.isActive ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                    }`}>
                      {court.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Court Modal */}
      {editingCourt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Editar Cancha</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Nombre</label>
                <input
                  type="text"
                  value={editingCourt.name}
                  onChange={(e) => setEditingCourt({...editingCourt, name: e.target.value})}
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30"
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Superficie</label>
                <select
                  value={editingCourt.surface}
                  onChange={(e) => setEditingCourt({...editingCourt, surface: e.target.value})}
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30"
                >
                  <option value="Sintética">Sintética</option>
                  <option value="Césped">Césped</option>
                  <option value="Cristal">Cristal</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Precio por hora (centavos)</label>
                <input
                  type="number"
                  value={editingCourt.basePrice}
                  onChange={(e) => setEditingCourt({...editingCourt, basePrice: parseInt(e.target.value)})}
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="indoor"
                  checked={editingCourt.indoor}
                  onChange={(e) => setEditingCourt({...editingCourt, indoor: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="indoor" className="text-white">Cancha interior</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingCourt.isActive}
                  onChange={(e) => setEditingCourt({...editingCourt, isActive: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-white">Cancha activa</label>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleUpdateCourt(editingCourt.id, editingCourt)}
                className="flex-1 px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditingCourt(null)}
                className="flex-1 px-6 py-3 bg-red-500/20 backdrop-blur-sm text-red-200 border border-red-300/30 font-semibold rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Court Modal */}
      {showAddCourt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Agregar Nueva Cancha</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Nombre</label>
                <input
                  type="text"
                  placeholder="Ej: Cancha 1"
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Superficie</label>
                <select className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30">
                  <option value="Sintética">Sintética</option>
                  <option value="Césped">Césped</option>
                  <option value="Cristal">Cristal</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Precio por hora (centavos)</label>
                <input
                  type="number"
                  placeholder="50000"
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="indoorNew"
                  className="w-4 h-4"
                />
                <label htmlFor="indoorNew" className="text-white">Cancha interior</label>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowAddCourt(false)}
                className="flex-1 px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition-colors"
              >
                Agregar
              </button>
              <button
                onClick={() => setShowAddCourt(false)}
                className="flex-1 px-6 py-3 bg-red-500/20 backdrop-blur-sm text-red-200 border border-red-300/30 font-semibold rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ClubAdminPageWrapper() {
  return (
    <ProtectedRoute requiredRoles={["CLUB", "ADMIN"]}>
      <ClubAdminPage />
    </ProtectedRoute>
  );
}
