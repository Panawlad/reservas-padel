import { Request, Response, NextFunction } from "express";
import { prisma } from "../db";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      // Consultar el usuario y su rol
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "No tienes permiso para realizar esta acción" });
      }

      next();
    } catch (error) {
      console.error("Error en authorizeRoles:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  };
};
