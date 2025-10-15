"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "USER" | "CLUB" | "ADMIN";
  requiredRoles?: ("USER" | "CLUB" | "ADMIN")[];
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredRoles,
  fallbackPath = "/auth",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasRole, hasAnyRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(fallbackPath);
        return;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        router.push("/");
        return;
      }

      if (requiredRoles && !hasAnyRole(requiredRoles)) {
        router.push("/");
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, requiredRoles, router, fallbackPath, hasRole, hasAnyRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return null;
  }

  return <>{children}</>;
}
