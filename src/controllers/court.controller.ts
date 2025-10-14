import { Request, Response } from "express";
import { prisma } from "../db";

/**
 * Crear cancha (solo CLUB)
 */
export const createCourt = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const role = (req as any).role;

    if (role !== "CLUB") {
      return res.status(403).json({ error: "Solo los clubes pueden registrar canchas" });
    }

    const { name, surface, indoor, basePrice, clubId } = req.body;

    if (!name || !clubId) {
      return res.status(400).json({ error: "Faltan campos obligatorios: name y clubId" });
    }

    // Verificar que el club pertenece al usuario actual
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club || club.ownerId !== userId) {
      return res.status(403).json({
        error: "No puedes registrar canchas en un club que no te pertenece",
      });
    }

    const court = await prisma.court.create({
      data: {
        name,
        surface,
        indoor: indoor || false,
        basePrice: basePrice || 0,
        clubId,
      },
    });

    res.status(201).json({ message: "Cancha creada correctamente", court });
  } catch (error) {
    console.error("Error en createCourt:", error);
    res.status(500).json({ error: "Error al crear la cancha" });
  }
};

/**
 * Obtener todas las canchas (ADMIN o CLUB propietario)
 */
export const getCourts = async (req: Request, res: Response) => {
  try {
    const role = (req as any).role;
    const userId = (req as any).userId;

    if (role === "ADMIN") {
      const courts = await prisma.court.findMany({ include: { club: true } });
      return res.json(courts);
    }

    if (role === "CLUB") {
      const clubs = await prisma.club.findMany({
        where: { ownerId: userId },
        include: { courts: true },
      });
      return res.json(clubs.flatMap((c) => c.courts));
    }

    res.status(403).json({ error: "No autorizado" });
  } catch (error) {
    console.error("Error en getCourts:", error);
    res.status(500).json({ error: "Error al obtener las canchas" });
  }
};

/**
 * Obtener una cancha por ID (para detalle + club)
 */
export const getCourtById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const court = await prisma.court.findUnique({
      where: { id },
      include: {
        club: { select: { id: true, name: true, city: true, address: true, zone: true } },
      },
    });

    if (!court) {
      return res.status(404).json({ error: "Cancha no encontrada" });
    }

    res.json(court);
  } catch (error) {
    console.error("Error en getCourtById:", error);
    res.status(500).json({ error: "Error al obtener la cancha" });
  }
};

/**
 * Actualizar cancha
 */
export const updateCourt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const role = (req as any).role;

    const court = await prisma.court.findUnique({
      where: { id },
      include: { club: true },
    });

    if (!court) return res.status(404).json({ error: "Cancha no encontrada" });

    if (role !== "ADMIN" && court.club.ownerId !== userId) {
      return res.status(403).json({ error: "No tienes permiso para editar esta cancha" });
    }

    const updated = await prisma.court.update({
      where: { id },
      data: req.body,
    });

    res.json({ message: "Cancha actualizada", court: updated });
  } catch (error) {
    console.error("Error en updateCourt:", error);
    res.status(500).json({ error: "Error al actualizar la cancha" });
  }
};

/**
 * Eliminar cancha (solo ADMIN o dueño del club)
 */
export const deleteCourt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const role = (req as any).role;

    const court = await prisma.court.findUnique({
      where: { id },
      include: { club: true },
    });

    if (!court) return res.status(404).json({ error: "Cancha no encontrada" });

    if (role !== "ADMIN" && court.club.ownerId !== userId) {
      return res.status(403).json({ error: "No autorizado para eliminar esta cancha" });
    }

    await prisma.court.delete({ where: { id } });
    res.json({ message: "Cancha eliminada correctamente" });
  } catch (error) {
    console.error("Error en deleteCourt:", error);
    res.status(500).json({ error: "Error al eliminar la cancha" });
  }
};
