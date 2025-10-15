"use client";

import { useAuth } from "../hooks/useAuth";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="px-4 py-2 bg-red-500/20 backdrop-blur-sm text-red-200 border border-red-300/30 text-sm font-semibold rounded-lg hover:bg-red-500/30 transition-colors"
    >
      Cerrar Sesión
    </button>
  );
}
