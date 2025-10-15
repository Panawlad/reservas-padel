"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: "USER" | "CLUB" | "ADMIN";
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthState({
      user,
      token,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    try {
      // Limpiar localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userProfile");
      
      // Actualizar estado
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
      
      // Redirigir a la página principal
      router.push("/");
      
      // Forzar recarga para asegurar que el estado se actualice
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      // En caso de error, forzar limpieza
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const hasRole = (role: "USER" | "CLUB" | "ADMIN") => {
    return authState.user?.role === role;
  };

  const hasAnyRole = (roles: ("USER" | "CLUB" | "ADMIN")[]) => {
    return authState.user && roles.includes(authState.user.role);
  };

  const canAccessClubAdmin = () => {
    return hasRole("CLUB") || hasRole("ADMIN");
  };

  const canAccessGlobalAdmin = () => {
    return hasRole("ADMIN");
  };

  return {
    ...authState,
    login,
    logout,
    hasRole,
    hasAnyRole,
    canAccessClubAdmin,
    canAccessGlobalAdmin,
  };
};
