import { Request, Response } from "express";
import { prisma } from "../db";

/**
 * Genera automáticamente los timeslots de una cancha en una fecha
 * basándose en su horario (Schedule)
 */
export const generateTimeslots = async (req: Request, res: Response) => {
  try {
    const { courtId, date } = req.body; // formato YYYY-MM-DD
    const userId = (req as any).userId;
    const role = (req as any).role;

    if (role !== "CLUB" && role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Solo clubes o administradores pueden generar horarios" });
    }

    const court = await prisma.court.findUnique({
      where: { id: courtId },
      include: { club: true },
    });

    if (!court) return res.status(404).json({ error: "Cancha no encontrada" });
    if (role === "CLUB" && court.club.ownerId !== userId)
      return res
        .status(403)
        .json({ error: "No puedes modificar canchas de otro club" });

    const dateObj = new Date(date);
    const weekday = dateObj.getUTCDay(); // 0 domingo ... 6 sábado

    const schedule = await prisma.schedule.findFirst({
      where: { courtId, weekday },
    });

    if (!schedule)
      return res
        .status(404)
        .json({ error: "No hay horario configurado para este día" });

    const openHour = parseInt(schedule.openTime.split(":")[0]);
    const closeHour = parseInt(schedule.closeTime.split(":")[0]);
    const slotMinutes = schedule.slotMinutes;
    const slots: any[] = [];

    let current = openHour * 60;
    const end = closeHour * 60;

    while (current + slotMinutes <= end) {
      const startHour = Math.floor(current / 60)
        .toString()
        .padStart(2, "0");
      const startMin = (current % 60).toString().padStart(2, "0");
      const endMinTotal = current + slotMinutes;
      const endHour = Math.floor(endMinTotal / 60)
        .toString()
        .padStart(2, "0");
      const endMin = (endMinTotal % 60).toString().padStart(2, "0");

      slots.push({
        date: new Date(date),
        startTime: `${startHour}:${startMin}`,
        endTime: `${endHour}:${endMin}`,
        priceCents: schedule.priceOverride ?? court.basePrice,
        currency: "MXN",
        clubId: court.clubId,
        courtId: court.id,
      });

      current += slotMinutes;
    }

    const created = await prisma.timeslot.createMany({
      data: slots,
      skipDuplicates: true,
    });

    res.json({
      message: "Timeslots generados correctamente",
      count: created.count,
    });
  } catch (error) {
    console.error("Error en generateTimeslots:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Listar timeslots disponibles de una cancha (por query: courtId + date)
 */
export const getAvailableTimeslots = async (req: Request, res: Response) => {
  try {
    const { courtId, date } = req.query;

    if (!courtId || !date)
      return res.status(400).json({ error: "Faltan parámetros courtId o date" });

    const slots = await prisma.timeslot.findMany({
      where: {
        courtId: courtId as string,
        date: new Date(date as string),
        status: "AVAILABLE",
      },
      orderBy: { startTime: "asc" },
    });

    res.json(slots);
  } catch (error) {
    console.error("Error en getAvailableTimeslots:", error);
    res.status(500).json({ error: "Error al obtener los timeslots" });
  }
};

/**
 * ✅ Obtener todos los timeslots de una cancha (sin filtrar por fecha)
 * Ideal para la vista /courts/:id
 */
export const getTimeslotsByCourt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const court = await prisma.court.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!court) return res.status(404).json({ error: "Cancha no encontrada" });

    const timeslots = await prisma.timeslot.findMany({
      where: { courtId: id },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        status: true,
        priceCents: true,
        currency: true,
      },
    });

    if (timeslots.length === 0)
      return res
        .status(404)
        .json({ message: "No hay horarios generados para esta cancha" });

    res.json({
      court,
      total: timeslots.length,
      timeslots,
    });
  } catch (error) {
    console.error("Error en getTimeslotsByCourt:", error);
    res.status(500).json({ error: "Error al obtener los horarios de la cancha" });
  }
};
