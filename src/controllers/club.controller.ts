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
      include: { 
        owner: true,
        courts: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            surface: true,
            basePrice: true,
            isActive: true,
            currency: true,
            indoor: true,
          },
        },
      },
    });

    if (!club) return res.status(404).json({ error: "Club no encontrado" });

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
 * Obtener el club del usuario actual (solo CLUB)
 */
export const getMyClub = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const club = await prisma.club.findFirst({
      where: { 
        ownerId: userId,
        isActive: true 
      },
      include: {
        courts: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            surface: true,
            basePrice: true,
            isActive: true,
            currency: true,
            indoor: true,
          },
        },
      },
    });

    if (!club) {
      return res.status(404).json({ error: "No tienes un club registrado" });
    }

    res.json(club);
  } catch (error) {
    console.error("Error en getMyClub:", error);
    res.status(500).json({ error: "Error al obtener el club" });
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

/**
 * Obtener estadísticas de ingresos del club
 */
export const getClubEarnings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { startDate, endDate } = req.query;

    // Obtener el club del usuario
    const club = await prisma.club.findFirst({
      where: { ownerId: userId },
    });

    if (!club) {
      return res.status(404).json({ error: "Club no encontrado para este usuario." });
    }

    const whereClause: any = {
      clubId: club.id,
      status: 'PAID',
    };

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const stats = await prisma.reservation.aggregate({
      where: whereClause,
      _sum: {
        totalCents: true,
        platformFeeCents: true,
        clubFeeCents: true,
      },
      _count: {
        id: true,
      },
    });

    const totalRevenue = stats._sum.totalCents || 0;
    const platformRevenue = stats._sum.platformFeeCents || 0;
    const clubRevenue = stats._sum.clubFeeCents || 0;
    const totalReservations = stats._count.id || 0;

    res.json({
      club: {
        id: club.id,
        name: club.name,
        city: club.city,
        zone: club.zone,
      },
      totalRevenue,
      platformRevenue,
      clubRevenue,
      totalReservations,
      averageReservationValue: totalReservations > 0 ? Math.round(totalRevenue / totalReservations) : 0,
      platformPercentage: totalRevenue > 0 ? Math.round((platformRevenue / totalRevenue) * 100) : 0,
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas del club:", error);
    res.status(500).json({ error: "Error obteniendo estadísticas del club" });
  }
};
