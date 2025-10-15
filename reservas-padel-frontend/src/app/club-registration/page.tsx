"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function ClubRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "",
    zone: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aquí enviarías los datos a tu API para procesar el registro
      console.log("Datos del club:", formData);
      
      // Simular envío exitoso
      alert("¡Solicitud enviada! Te contactaremos pronto para activar tu club.");
      router.push("/");
    } catch (error) {
      console.error("Error enviando solicitud:", error);
      alert("Error al enviar la solicitud. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
              🏢 Registra tu Club
            </h1>
            <p className="text-lg text-white/80">
              Únete a nuestra plataforma y aumenta tus ingresos
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

      <div className="px-4 max-w-4xl mx-auto">
        {/* Benefits Section */}
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            ¿Por qué unirte a ReservasPádel?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-white mb-2">Más Clientes</h3>
              <p className="text-white/80">Accede a miles de jugadores en tu zona</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-white mb-2">Ingresos Garantizados</h3>
              <p className="text-white/80">Recibe pagos automáticamente</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-white mb-2">Gestión Fácil</h3>
              <p className="text-white/80">Panel intuitivo para gestionar todo</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Información del Club
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Nombre del Club *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                  placeholder="Ej: Club Pádel Central"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                  placeholder="Ej: Ciudad de México"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Zona/Colonia *
                </label>
                <input
                  type="text"
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                  placeholder="Ej: Del Valle, Polanco"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                  placeholder="Dirección completa"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Teléfono del Club
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                  placeholder="+52 55 1234 5678"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Email del Club
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                  placeholder="club@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Descripción del Club *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50 resize-none"
                placeholder="Describe las características y servicios de tu club..."
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Sitio Web (opcional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                placeholder="https://www.tuclub.com"
              />
            </div>

            <div className="border-t border-white/20 pt-6">
              <h3 className="text-2xl font-bold text-white mb-4">
                Información del Propietario
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
                    placeholder="+52 55 1234 5678"
                  />
                </div>
              </div>
            </div>

            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-4 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-bold text-lg rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Enviando..." : "Enviar Solicitud"}
              </button>
              
              <p className="text-white/70 text-sm mt-4">
                * Campos obligatorios. Te contactaremos en 24-48 horas.
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
