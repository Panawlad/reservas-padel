"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    alert("¡Mensaje enviado! Te contactaremos pronto.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 pt-6">
        <nav className="flex items-center justify-between rounded-2xl px-6 py-4 modern-card backdrop-blur-sm bg-white/80">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-primary">
              <span className="text-white text-lg">🏓</span>
            </div>
            <span className="font-bold text-xl text-gray-900">ReservasPádel</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
              Inicio
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium">
              Quiénes somos
            </Link>
            <Link href="/contact" className="text-blue-600 font-semibold">
              Contacto
            </Link>
            <Link 
              href="/auth" 
              className="px-6 py-2.5 primary-button text-sm font-semibold rounded-lg"
            >
              Entrar
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Contacto
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ¿Tienes alguna pregunta? ¿Necesitas ayuda? Estamos aquí para ayudarte. 
            Contáctanos y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="modern-card p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="modern-input w-full"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="modern-input w-full"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Asunto *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="modern-input w-full"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="reserva">Problema con reserva</option>
                  <option value="pago">Problema con pago</option>
                  <option value="club">Información sobre club</option>
                  <option value="tecnico">Soporte técnico</option>
                  <option value="sugerencia">Sugerencia</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="modern-input w-full resize-none"
                  placeholder="Cuéntanos en detalle cómo podemos ayudarte..."
                />
              </div>

              <button
                type="submit"
                className="w-full primary-button py-4 text-lg font-semibold rounded-lg"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="modern-card p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Información de contacto</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">info@reservaspadel.com</p>
                    <p className="text-gray-600">soporte@reservaspadel.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-success flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Teléfono</h3>
                    <p className="text-gray-600">+34 900 123 456</p>
                    <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-warning flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Dirección</h3>
                    <p className="text-gray-600">
                      Calle del Pádel, 123<br />
                      28001 Madrid, España
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-error flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">💬</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Chat en vivo</h3>
                    <p className="text-gray-600">Disponible 24/7 en la app</p>
                    <p className="text-gray-600">Tiempo de respuesta: &lt; 5 min</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="modern-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Preguntas frecuentes</h2>
              
              <div className="space-y-4">
                {[
                  {
                    question: "¿Cómo puedo cancelar una reserva?",
                    answer: "Puedes cancelar tu reserva desde la sección 'Mis Reservas' hasta 2 horas antes del inicio."
                  },
                  {
                    question: "¿Qué métodos de pago aceptan?",
                    answer: "Aceptamos tarjetas de crédito/débito y pagos con USDC a través de Solana."
                  },
                  {
                    question: "¿Hay descuentos para reservas frecuentes?",
                    answer: "Sí, ofrecemos descuentos especiales para usuarios frecuentes y membresías premium."
                  },
                  {
                    question: "¿Puedo reservar para grupos grandes?",
                    answer: "Por supuesto, contáctanos para reservas de más de 4 personas y te ayudaremos con la organización."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{faq.question}</h3>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Necesitas ayuda inmediata?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Nuestro equipo de soporte está disponible 24/7 para ayudarte
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="tel:+34900123456" 
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
              📞 Llamar ahora
            </a>
            <a 
              href="mailto:soporte@reservaspadel.com" 
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
            >
              📧 Enviar email
            </a>
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
