import { Request, Response } from "express";
import { prisma } from "../db";

/**
 * Crear un nuevo club (solo ADMIN)
 */
export const createClub = async (req: Request, res: Response) => {
  try {
    const { name, description, address, city, zone, lat, lng, ownerId } = req.body;

    if (!name || !ownerId) {
      return res.status(400).json({ error: "El nombre y el ownerId son obligatorios" });
    }

    const ownerExists = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!ownerExists) {
      return res.status(404).json({ error: "Propietario no encontrado" });
    }

    const club = await prisma.club.create({
      data: {
        name,
        description,
        address,
        city,
        zone,
        lat,
        lng,
        ownerId,
      },
    });

    res.status(201).json({ message: "Club creado correctamente", club });
  } catch (error) {
    console.error("Error en createClub:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Obtener todos los clubes (visible para ADMIN)
 */
/**
 * Obtener todos los clubes (visible para cualquier usuario autenticado)
 * Muestra también sus canchas activas
 */
export const getAllClubs = async (_req: Request, res: Response) => {
  try {
    const clubs = await prisma.club.findMany({
      where: { isActive: true }, // Solo clubes activos
      include: {
        owner: {
          select: { id: true, email: true, name: true },
        },
        courts: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            surface: true,
            basePrice: true,
            isActive: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    res.json(clubs);
  } catch (error) {
    console.error("Error en getAllClubs:", error);
    res.status(500).json({ error: "Error al obtener los clubes" });
  }
};

/**
 * Obtener un club por ID (ADMIN o CLUB propietario)
 */
export const getClubById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const club = await prisma.club.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!club) return res.status(404).json({ error: "Club no encontrado" });

    if (club.ownerId !== userId && (req as any).role !== "ADMIN") {
      return res.status(403).json({ error: "No tienes acceso a este club" });
    }

    res.json(club);
  } catch (error) {
    console.error("Error en getClubById:", error);
    res.status(500).json({ error: "Error al obtener el club" });
  }
};

/**
 * Actualizar un club (solo ADMIN o el propietario)
 */
export const updateClub = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const role = (req as any).role;

    const club = await prisma.club.findUnique({ where: { id } });
    if (!club) return res.status(404).json({ error: "Club no encontrado" });

    if (club.ownerId !== userId && role !== "ADMIN") {
      return res.status(403).json({ error: "No tienes permiso para editar este club" });
    }

    const updated = await prisma.club.update({
      where: { id },
      data: req.body,
    });

    res.json({ message: "Club actualizado", club: updated });
  } catch (error) {
    console.error("Error en updateClub:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Desactivar (soft delete) un club (solo ADMIN)
 */
export const deactivateClub = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const club = await prisma.club.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: "Club desactivado", club });
  } catch (error) {
    console.error("Error en deactivateClub:", error);
    res.status(500).json({ error: "Error al desactivar el club" });
  }
};
