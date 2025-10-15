"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ProtectedRoute from "../../components/ProtectedRoute";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface CommissionStats {
  totalRevenue: number;
  platformRevenue: number;
  clubRevenue: number;
  totalReservations: number;
  averageReservationValue: number;
  platformPercentage: number;
}

function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CommissionStats | null>(null);
  const [commissionConfig, setCommissionConfig] = useState({
    platformFeeBps: 1000,
    clubFeeBps: 9000,
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  useEffect(() => {
    if (!token) {
      router.push("/auth");
      return;
    }

    loadStats();
  }, [token, router]);

  const loadStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/commissions/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(data);
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCommissionConfig = async () => {
    try {
      await axios.put(`${API_URL}/commissions/config`, commissionConfig, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Configuración de comisiones actualizada");
      loadStats();
    } catch (err) {
      console.error("Error actualizando configuración:", err);
      alert("Error al actualizar la configuración");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4">Cargando dashboard...</p>
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
              🎛️ Panel Administrativo
            </h1>
            <p className="text-lg text-white/80">
              Gestión global de la plataforma
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition-colors"
          >
            ← Volver
          </button>
        </div>
      </header>

      <div className="px-4 space-y-8">
        {/* Estadísticas Generales */}
        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="text-lg font-bold text-white mb-1">Ingresos Totales</h3>
              <p className="text-2xl font-bold text-white">
                ${(stats.totalRevenue / 100).toFixed(2)}
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="text-lg font-bold text-white mb-1">Comisión Plataforma</h3>
              <p className="text-2xl font-bold text-white">
                ${(stats.platformRevenue / 100).toFixed(2)}
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
              <div className="text-3xl mb-2">🏢</div>
              <h3 className="text-lg font-bold text-white mb-1">Pagos a Clubes</h3>
              <p className="text-2xl font-bold text-white">
                ${(stats.clubRevenue / 100).toFixed(2)}
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="text-lg font-bold text-white mb-1">Reservas Totales</h3>
              <p className="text-2xl font-bold text-white">
                {stats.totalReservations}
              </p>
            </div>
          </div>
        )}

        {/* Configuración de Comisiones */}
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Configuración de Comisiones
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Comisión Plataforma (%)
              </label>
              <input
                type="number"
                value={commissionConfig.platformFeeBps / 100}
                onChange={(e) => setCommissionConfig({
                  ...commissionConfig,
                  platformFeeBps: parseInt(e.target.value) * 100,
                  clubFeeBps: 10000 - (parseInt(e.target.value) * 100)
                })}
                className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Comisión Clubes (%)
              </label>
              <input
                type="number"
                value={commissionConfig.clubFeeBps / 100}
                onChange={(e) => setCommissionConfig({
                  ...commissionConfig,
                  clubFeeBps: parseInt(e.target.value) * 100,
                  platformFeeBps: 10000 - (parseInt(e.target.value) * 100)
                })}
                className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={updateCommissionConfig}
              className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg hover:bg-white/30 transition-colors"
            >
              Actualizar Configuración
            </button>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-white mb-2">Gestionar Clubes</h3>
            <p className="text-white/80 mb-4">Administrar clubes afiliados</p>
            <button
              onClick={() => router.push("/clubs")}
              className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
            >
              Ver Clubes
            </button>
          </div>

          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-2">Usuarios</h3>
            <p className="text-white/80 mb-4">Gestionar usuarios registrados</p>
            <button
              onClick={() => alert("Funcionalidad en desarrollo")}
              className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
            >
              Ver Usuarios
            </button>
          </div>

          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Reportes</h3>
            <p className="text-white/80 mb-4">Generar reportes detallados</p>
            <button
              onClick={() => alert("Funcionalidad en desarrollo")}
              className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
            >
              Ver Reportes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminDashboardWrapper() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminDashboard />
    </ProtectedRoute>
  );
}