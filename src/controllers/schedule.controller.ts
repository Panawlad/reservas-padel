import { Request, Response } from "express";
import { prisma } from "../db";

/**
 * Crear horario semanal para una cancha (solo CLUB)
 */
export const createSchedule = async (req: Request, res: Response) => {
  try {
    const { courtId, weekday, openTime, closeTime, slotMinutes, priceOverride } = req.body;
    const userId = (req as any).userId;
    const role = (req as any).role;

    if (role !== "CLUB") return res.status(403).json({ error: "Solo los clubes pueden crear horarios" });

    // Verifica que la cancha le pertenezca al club actual
    const court = await prisma.court.findUnique({
      where: { id: courtId },
      include: { club: true },
    });

    if (!court || court.club.ownerId !== userId)
      return res.status(403).json({ error: "No puedes modificar canchas que no son tuyas" });

    const schedule = await prisma.schedule.create({
      data: {
        courtId,
        clubId: court.clubId,
        weekday,
        openTime,
        closeTime,
        slotMinutes: slotMinutes || 60,
        priceOverride,
      },
    });

    res.status(201).json({ message: "Horario creado correctamente", schedule });
  } catch (error) {
    console.error("Error en createSchedule:", error);
    res.status(500).json({ error: "Error al crear el horario" });
  }
};

/**
 * Obtener horarios de una cancha
 */
export const getSchedulesByCourt = async (req: Request, res: Response) => {
  try {
    const { courtId } = req.params;

    const schedules = await prisma.schedule.findMany({
      where: { courtId },
      orderBy: { weekday: "asc" },
    });

    res.json(schedules);
  } catch (error) {
    console.error("Error en getSchedulesByCourt:", error);
    res.status(500).json({ error: "Error al obtener los horarios" });
  }
};
