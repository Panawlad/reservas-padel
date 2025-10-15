"use client";

import Link from "next/link";

export default function AboutPage() {
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
      <header className="w-full px-4 pt-6">
        <nav className="flex items-center justify-between rounded-2xl px-6 py-4 backdrop-blur-sm bg-white/20 border border-white/30">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
              <span className="text-white text-lg">🏓</span>
            </div>
            <span className="font-bold text-xl text-white">ReservasPádel</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/90 hover:text-white font-medium transition-colors">
              Inicio
            </Link>
            <Link href="/about" className="text-white font-semibold">
              Quiénes somos
            </Link>
            <Link href="/contact" className="text-white/90 hover:text-white font-medium transition-colors">
              Contacto
            </Link>
            <Link 
              href="/auth" 
              className="px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 text-sm font-semibold rounded-lg hover:bg-white/30 transition-colors"
            >
              Entrar
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full px-4 pt-16 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Quiénes somos
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Somos la plataforma líder en reservas de pádel, conectando jugadores 
            con los mejores clubes y canchas de la región.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="px-4 grid lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
              <span className="text-3xl">🎯</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">Nuestra Misión</h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Facilitar el acceso a canchas de pádel de calidad, ofreciendo una experiencia 
              de reserva rápida, segura y moderna. Queremos que cada jugador encuentre 
              su cancha perfecta en el momento ideal.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
              <span className="text-3xl">👁️</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">Nuestra Visión</h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Ser la plataforma de referencia en el mundo del pádel, creando una comunidad 
              global de jugadores conectados a través de la tecnología más avanzada 
              en reservas deportivas.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="px-4 mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Nuestros Valores
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚀",
                title: "Innovación",
                description: "Utilizamos la tecnología más avanzada para ofrecer la mejor experiencia de usuario."
              },
              {
                icon: "🤝",
                title: "Confianza",
                description: "Garantizamos transacciones seguras y reservas confiables en cada paso."
              },
              {
                icon: "⚡",
                title: "Eficiencia",
                description: "Procesos rápidos y sencillos para que te enfoques en lo que importa: jugar."
              },
              {
                icon: "🌟",
                title: "Calidad",
                description: "Trabajamos solo con clubes verificados y canchas de excelente nivel."
              },
              {
                icon: "💚",
                title: "Comunidad",
                description: "Fomentamos la conexión entre jugadores y el crecimiento del deporte."
              },
              {
                icon: "🔒",
                title: "Seguridad",
                description: "Protegemos tus datos y pagos con los más altos estándares de seguridad."
              }
            ].map((value, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{value.title}</h3>
                <p className="text-white/80">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="modern-card p-12 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Nuestro Equipo</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Somos un equipo apasionado por el pádel y la tecnología, trabajando día a día 
            para mejorar tu experiencia de reserva y conectar la comunidad padelera.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Equipo de Desarrollo",
                role: "Tecnología",
                description: "Expertos en crear la mejor experiencia digital"
              },
              {
                name: "Equipo Comercial",
                role: "Partnerships",
                description: "Conectamos con los mejores clubes de la región"
              },
              {
                name: "Equipo de Soporte",
                role: "Atención al Cliente",
                description: "Siempre listos para ayudarte con cualquier consulta"
              }
            ].map((member, index) => (
              <div key={index} className="p-6">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl text-white">👥</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para empezar a jugar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de jugadores que ya confían en ReservasPádel
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/home" 
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Explorar Clubes
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <span className="text-white text-lg">🏓</span>
                </div>
                <span className="font-bold text-xl">ReservasPádel</span>
              </div>
              <p className="text-gray-400">
                La plataforma más moderna para reservar canchas de pádel.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">Inicio</Link></li>
                <li><Link href="/about" className="hover:text-white">Quiénes somos</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Servicios</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/home" className="hover:text-white">Reservar Cancha</Link></li>
                <li><Link href="/reservations" className="hover:text-white">Mis Reservas</Link></li>
                <li><Link href="/auth" className="hover:text-white">Iniciar Sesión</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@reservaspadel.com</li>
                <li>📞 +34 900 123 456</li>
                <li>📍 Madrid, España</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} ReservasPádel. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
