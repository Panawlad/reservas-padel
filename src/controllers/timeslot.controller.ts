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
    const { date } = req.query; // Fecha opcional, por defecto hoy

    console.log("🔍 Obteniendo timeslots para cancha:", id, "fecha:", date);

    const court = await prisma.court.findUnique({
      where: { id },
      include: { 
        club: true,
        schedules: {
          where: { isActive: true },
          orderBy: { weekday: 'asc' }
        }
      },
    });

    if (!court) return res.status(404).json({ error: "Cancha no encontrada" });

    console.log("📅 Schedules encontrados:", court.schedules.length);

    // Si no hay schedules, devolver array vacío
    if (court.schedules.length === 0) {
      console.log("⚠️ No hay schedules activos para esta cancha");
      return res.json({ timeslots: [] });
    }

    // Generar timeslots dinámicamente basados en los schedules
    const targetDate = date ? new Date(date as string) : new Date();
    const weekday = targetDate.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    console.log("📅 Fecha objetivo:", targetDate.toISOString().split('T')[0]);
    console.log("📅 Día de la semana:", weekday);

    // Buscar schedule para el día de la semana
    const schedule = court.schedules.find(s => s.weekday === weekday);
    
    if (!schedule) {
      console.log("⚠️ No hay schedule para el día", weekday);
      return res.json({ timeslots: [] });
    }

    console.log("✅ Schedule encontrado:", schedule);

    // Generar timeslots basados en el schedule
    const timeslots = [];
    const startTime = new Date(`2000-01-01T${schedule.openTime}`);
    const endTime = new Date(`2000-01-01T${schedule.closeTime}`);
    const slotDuration = schedule.slotMinutes;

    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);
      
      if (slotEnd <= endTime) {
        const price = schedule.priceOverride || court.basePrice;
        
        timeslots.push({
          id: `generated-${court.id}-${currentTime.getTime()}`,
          startTime: currentTime.toTimeString().slice(0, 5),
          endTime: slotEnd.toTimeString().slice(0, 5),
          status: "AVAILABLE",
          priceCents: Math.round(price * 100), // Convertir a centavos
          currency: court.currency || "MXN"
        });
      }
      
      currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
    }

    console.log("🎯 Timeslots generados:", timeslots.length);
    res.json({ timeslots });
  } catch (error) {
    console.error("Error en getTimeslotsByCourt:", error);
    res.status(500).json({ error: "Error al obtener los horarios de la cancha" });
  }
};
