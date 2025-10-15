"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login, signup } from "@/lib/api";
import { useAuth } from "../../hooks/useAuth";

export default function AuthPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    try {
      setLoading(true);

      if (mode === "signup") {
        if (!name || !age || !weight) {
          toast.error("Completa todos los campos");
          return;
        }

        const res = await signup(email, password, "USER");
        
        // Usar el hook de autenticación
        authLogin({
          id: res.user.id,
          email: res.user.email,
          role: res.user.role,
          name: name,
        }, res.token);

        // guardar datos del perfil (extra, opcional)
        localStorage.setItem("userProfile", JSON.stringify({ name, age, weight }));

        toast.success("Cuenta creada ✅");
      } else {
        const res = await login(email, password);
        
        // Usar el hook de autenticación
        authLogin({
          id: res.user.id,
          email: res.user.email,
          role: res.user.role,
          name: res.user.name || "",
        }, res.token);
        
        toast.success("Sesión iniciada 🚀");
      }

      router.push("/");
    } catch (error) {
      toast.error("Error en la autenticación");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center px-4">
      {/* Background decorative elements */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px 600px at -10% -20%, rgba(255, 255, 255, 0.1), transparent 60%), radial-gradient(900px 500px at 110% 10%, rgba(255, 255, 255, 0.1), transparent 60%)',
        }}
      />

      <div className="w-full max-w-md bg-white/20 backdrop-blur-sm border border-white/30 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <span className="text-xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
          <p className="text-sm text-white/80">
            {mode === "login" ? "Accede a tu cuenta" : "Únete a la comunidad"}
          </p>
        </div>

        {mode === "signup" && (
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Edad"
              className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <input
              type="number"
              placeholder="Peso (kg)"
              className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-4 mb-6">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 placeholder-white/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold text-lg transition-all duration-300 hover:bg-white/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "⏳ Procesando..." : mode === "login" ? "🚀 Entrar" : "✨ Registrarme"}
        </button>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-6 w-full text-sm text-white/80 hover:text-white transition-colors duration-300"
        >
          {mode === "login"
            ? "¿No tienes cuenta? Regístrate"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </div>
    </main>
  );
}
