"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login, signup } from "@/lib/api";

export default function AuthPage() {
  const router = useRouter();
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
        localStorage.setItem("token", res.token);

        // guardar datos del perfil (extra, opcional)
        localStorage.setItem("userProfile", JSON.stringify({ name, age, weight }));

        toast.success("Cuenta creada ✅");
      } else {
        const res = await login(email, password);
        localStorage.setItem("token", res.token);
        toast.success("Sesión iniciada 🚀");
      }

      router.push("/home");
    } catch (error) {
      toast.error("Error en la autenticación");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-800 text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>

        {mode === "signup" && (
          <>
            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full mb-4 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Edad"
              className="w-full mb-4 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <input
              type="number"
              placeholder="Peso (kg)"
              className="w-full mb-4 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 font-semibold"
        >
          {loading ? "Procesando..." : mode === "login" ? "Entrar" : "Registrarme"}
        </button>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-sm text-zinc-400 hover:text-zinc-200"
        >
          {mode === "login"
            ? "¿No tienes cuenta? Regístrate"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </div>
    </main>
  );
}
