"use client";

import Link from "next/link";
import ClientWalletButton from "@/components/ClientWalletButton";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated, canAccessClubAdmin, canAccessGlobalAdmin, user } = useAuth();

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

      {/* Top Navigation */}
      <header className="w-full px-4 pt-6">
        <nav className="flex items-center justify-between rounded-2xl px-6 py-4 backdrop-blur-sm bg-white/20 border border-white/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
              <span className="text-white text-lg">🏓</span>
            </div>
            <span className="font-bold text-xl text-white">ReservasPádel</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <Link href="/about" className="text-white/90 hover:text-white font-medium transition-colors">
                Quiénes somos
              </Link>
              <Link href="/contact" className="text-white/90 hover:text-white font-medium transition-colors">
                Contacto
              </Link>
              {canAccessClubAdmin() && (
                <Link href="/club-admin" className="text-white/90 hover:text-white font-medium transition-colors">
                  Admin Club
                </Link>
              )}
              {canAccessGlobalAdmin() && (
                <Link href="/admin" className="text-white/90 hover:text-white font-medium transition-colors">
                  Admin Global
                </Link>
              )}
            </div>
            <ClientWalletButton />
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-white/80 text-sm">
                  Hola, {user?.name || user?.email}
                </span>
                <Link 
                  href="/home" 
                  className="px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 text-sm font-semibold rounded-lg hover:bg-white/30 transition-colors"
                >
                  Ir a Clubes
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <Link 
                href="/auth" 
                className="px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 text-sm font-semibold rounded-lg hover:bg-white/30 transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section - Full Width */}
      <section className="w-full px-4 pt-20 pb-16">
        {/* Main Hero Banner */}
        <div className="relative bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-3xl p-12 mb-16 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-500/20 to-blue-500/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>
          
          {/* Content */}
          <div className="relative z-10 text-center">
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              RESERVAS PÁDEL
              <span className="block text-3xl md:text-4xl font-normal mt-4">
                PLATAFORMA DE CONEXIÓN
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
              Conectamos jugadores con los mejores clubes de pádel
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">🏓</div>
                <h3 className="text-xl font-bold text-white mb-2">Para Jugadores</h3>
                <p className="text-white/80">Encuentra y reserva canchas en tu zona</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-bold text-white mb-2">Para Clubes</h3>
                <p className="text-white/80">Gestiona tus canchas y aumenta tus ingresos</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-white mb-2">Pagos Flexibles</h3>
                <p className="text-white/80">Paga con tarjeta o USDC</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/home" 
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-bold text-lg rounded-xl hover:bg-white/30 transition-all duration-300 shadow-lg"
                prefetch={false}
              >
                Buscar Clubes
              </Link>
              <Link 
                href="/club-registration" 
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border border-white/30 font-bold text-lg rounded-xl hover:bg-white/30 transition-all duration-300"
              >
                Registrar mi Club
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { title: 'Clubes Verificados', icon: '🏆', text: 'Sitios confiables y seguros' },
            { title: 'Pagos Modernos', icon: '💳', text: 'FIAT y USDC al instante' },
            { title: 'Horarios en Tiempo Real', icon: '⏰', text: 'Disponibilidad actualizada' },
            { title: 'Acceso Digital', icon: '🔐', text: 'QR de confirmación' },
          ].map((f) => (
            <div key={f.title} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto bg-white/20 backdrop-blur-sm">
                <span className="text-3xl">{f.icon}</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-white">{f.title}</h3>
              <p className="text-white/80">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-4 pb-10 pt-10 flex items-center justify-between text-white/80">
        <span>© {new Date().getFullYear()} ReservasPádel - Todos los derechos reservados</span>
        <span className="text-sm">API: {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}</span>
      </footer>
    </main>
  );
}
