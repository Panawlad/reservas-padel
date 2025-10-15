"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LogoutButton() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="px-4 py-2 bg-red-500/20 backdrop-blur-sm text-red-200 border border-red-300/30 text-sm font-semibold rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
    </button>
  );
}
