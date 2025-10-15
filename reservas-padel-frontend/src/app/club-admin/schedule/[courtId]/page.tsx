"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProtectedRoute from "../../../../components/ProtectedRoute";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface Schedule {
  id: string;
  weekday: number;
  openTime: string;
  closeTime: string;
  slotMinutes: number;
  priceOverride?: number;
}

interface Court {
  id: string;
  name: string;
  surface: string;
  basePrice: number;
  isActive: boolean;
  currency: string;
  indoor: boolean;
  clubId: string;
}

function CourtSchedulePage({ params }: { params: Promise<{ courtId: string }> }) {
  const router = useRouter();
  const [court, setCourt] = useState<Court | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    weekday: "Lunes",
    openTime: "08:00",
    closeTime: "22:00",
    slotMinutes: 60,
    priceOverride: 0
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  useEffect(() => {
    if (!token) {
      router.push("/auth");
      return;
    }

    loadCourtData();
  }, [token, router]);

  const loadCourtData = async () => {
    try {
      const { courtId } = await params;
      
      // Obtener datos de la cancha
      const { data: courtData } = await axios.get(`${API_URL}/courts/${courtId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourt(courtData);

      // Obtener horarios de la cancha
      try {
        const { data: schedulesData } = await axios.get(`${API_URL}/schedules/${courtId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(schedulesData);
      } catch (scheduleErr) {
        console.error("Error cargando horarios:", scheduleErr);
        setSchedules([]);
      }
    } catch (err) {
      console.error("Error cargando datos de la cancha:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async () => {
    if (!court) return;

    try {
      const weekdayNumber = getWeekdayNumber(newSchedule.weekday);
      
      console.log("Enviando datos:", {
        courtId: court.id,
        weekday: weekdayNumber,
        openTime: newSchedule.openTime,
        closeTime: newSchedule.closeTime,
        slotMinutes: newSchedule.slotMinutes,
        priceOverride: newSchedule.priceOverride || null
      });

      const { data } = await axios.post(`${API_URL}/schedules/create`, {
        courtId: court.id,
        weekday: weekdayNumber,
        openTime: newSchedule.openTime,
        closeTime: newSchedule.closeTime,
        slotMinutes: newSchedule.slotMinutes,
        priceOverride: newSchedule.priceOverride || null
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Recargar la lista de horarios después de crear uno nuevo
      await loadCourtData();
      setShowAddSchedule(false);
      setNewSchedule({
        weekday: "Lunes",
        openTime: "08:00",
        closeTime: "22:00",
        slotMinutes: 60,
        priceOverride: 0
      });
      alert("Horario agregado exitosamente");
    } catch (err: any) {
      console.error("Error agregando horario:", err);
      console.error("Error details:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error headers:", err.response?.headers);
      console.error("Request data:", {
        courtId: court.id,
        weekday: newSchedule.weekday,
        openTime: newSchedule.openTime,
        closeTime: newSchedule.closeTime,
        slotMinutes: newSchedule.slotMinutes,
        priceOverride: newSchedule.priceOverride || null
      });
      alert(`Error al agregar el horario: ${err.response?.data?.error || err.message || "Error desconocido"}`);
    }
  };

  const weekdays = [
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
  ];

  // Función para convertir nombre del día a número (1=Lunes, 7=Domingo)
  const getWeekdayNumber = (weekdayName: string): number => {
    const dayMap: { [key: string]: number } = {
      "Lunes": 1,
      "Martes": 2,
      "Miércoles": 3,
      "Jueves": 4,
      "Viernes": 5,
      "Sábado": 6,
      "Domingo": 0
    };
    return dayMap[weekdayName] || 1;
  };

  // Función para convertir número del día a nombre
  const getWeekdayName = (weekdayNumber: number): string => {
    const numberMap: { [key: number]: string } = {
      0: "Domingo",
      1: "Lunes",
      2: "Martes",
      3: "Miércoles",
      4: "Jueves",
      5: "Viernes",
      6: "Sábado"
    };
    return numberMap[weekdayNumber] || "Lunes";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4">Cargando horarios...</p>
        </div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Cancha no encontrada</h2>
          <button
            onClick={() => router.push("/club-admin")}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
          >
            Volver al Club Admin
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
              ⏰ Horarios de {court.name}
            </h1>
            <p className="text-lg text-white/80">
              Configura los horarios de disponibilidad de tu cancha
            </p>
          </div>
          <button
            onClick={() => router.push("/club-admin")}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition-colors"
          >
            ← Volver
          </button>
        </div>
      </header>

      <div className="px-4 space-y-8">
        {/* Add Schedule Button */}
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Horarios Configurados</h2>
            <button
              onClick={() => setShowAddSchedule(true)}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition-colors"
            >
              + Agregar Horario
            </button>
          </div>

          {schedules.length === 0 ? (
            <div className="text-center text-white/70 py-8">
              <div className="text-4xl mb-4">⏰</div>
              <p className="text-lg">No hay horarios configurados</p>
              <p className="text-sm">Agrega horarios para que los usuarios puedan reservar</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-white">{getWeekdayName(schedule.weekday)}</h3>
                      <p className="text-white/70">
                        {schedule.openTime} - {schedule.closeTime}
                      </p>
                      <p className="text-sm text-white/60">
                        Slots de {schedule.slotMinutes} minutos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">
                        ${schedule.priceOverride ? (schedule.priceOverride / 100).toFixed(2) : (court.basePrice / 100).toFixed(2)}/hora
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Agregar Horario</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Día de la Semana</label>
                <select
                  value={newSchedule.weekday}
                  onChange={(e) => setNewSchedule({...newSchedule, weekday: e.target.value})}
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30"
                >
                  {weekdays.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Hora de Apertura</label>
                  <input
                    type="time"
                    value={newSchedule.openTime}
                    onChange={(e) => setNewSchedule({...newSchedule, openTime: e.target.value})}
                    className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Hora de Cierre</label>
                  <input
                    type="time"
                    value={newSchedule.closeTime}
                    onChange={(e) => setNewSchedule({...newSchedule, closeTime: e.target.value})}
                    className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Duración del Slot (minutos)</label>
                <select
                  value={newSchedule.slotMinutes}
                  onChange={(e) => setNewSchedule({...newSchedule, slotMinutes: parseInt(e.target.value)})}
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30"
                >
                  <option value={30}>30 minutos</option>
                  <option value={60}>60 minutos</option>
                  <option value={90}>90 minutos</option>
                  <option value={120}>120 minutos</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Precio Especial (opcional)</label>
                <input
                  type="number"
                  value={newSchedule.priceOverride}
                  onChange={(e) => setNewSchedule({...newSchedule, priceOverride: parseInt(e.target.value) || 0})}
                  placeholder="Dejar en 0 para usar precio base"
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                />
                <p className="text-white/60 text-sm mt-1">
                  Precio base: ${(court.basePrice / 100).toFixed(2)}/hora
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddSchedule}
                className="flex-1 px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition-colors"
              >
                Agregar Horario
              </button>
              <button
                onClick={() => setShowAddSchedule(false)}
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

export default function CourtSchedulePageWrapper({ params }: { params: Promise<{ courtId: string }> }) {
  return (
    <ProtectedRoute requiredRoles={["CLUB", "ADMIN"]}>
      <CourtSchedulePage params={params} />
    </ProtectedRoute>
  );
}
