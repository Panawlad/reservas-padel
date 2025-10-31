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
        // basePrice y priceOverride ya están en centavos según el schema
        const priceCents = schedule.priceOverride ?? court.basePrice;
        
        timeslots.push({
          id: `generated-${court.id}-${currentTime.getTime()}`,
          startTime: currentTime.toTimeString().slice(0, 5),
          endTime: slotEnd.toTimeString().slice(0, 5),
          status: "AVAILABLE",
          priceCents: priceCents, // Ya está en centavos
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

/**
 * ✅ Obtener un timeslot por ID
 * Maneja tanto timeslots reales (de BD) como generados dinámicamente
 */
export const getTimeslotById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Si es un timeslot generado dinámicamente (formato: generated-{courtId}-{timestamp})
    if (id.startsWith('generated-')) {
      // El courtId puede ser un UUID, así que necesitamos extraerlo diferente
      // Formato: generated-{courtId}-{timestamp}
      const lastDashIndex = id.lastIndexOf('-');
      const timestampPart = id.substring(lastDashIndex + 1);
      const courtIdPart = id.substring('generated-'.length, lastDashIndex);
      
      const courtId = courtIdPart;
      const timestamp = parseInt(timestampPart);

      if (!courtId || isNaN(timestamp)) {
        return res.status(400).json({ error: "ID de timeslot generado inválido" });
      }

      // Obtener la cancha y su información
      const court = await prisma.court.findUnique({
        where: { id: courtId },
        include: { 
          club: true,
          schedules: {
            where: { isActive: true },
            orderBy: { weekday: 'asc' }
          }
        },
      });

      if (!court) {
        return res.status(404).json({ error: "Cancha no encontrada" });
      }

      // Extraer la hora del timestamp (el timestamp es relativo a 2000-01-01)
      const baseDate = new Date(`2000-01-01T00:00:00`);
      const slotTimeFromBase = new Date(timestamp);
      const hours = slotTimeFromBase.getHours();
      const minutes = slotTimeFromBase.getMinutes();
      
      // Obtener la fecha real (de query param o usar hoy)
      const { date } = req.query;
      const targetDate = date ? new Date(date as string) : new Date();
      targetDate.setHours(0, 0, 0, 0);
      const weekday = targetDate.getDay();

      // Buscar schedule para ese día
      const schedule = court.schedules.find(s => s.weekday === weekday);
      
      if (!schedule) {
        return res.status(404).json({ error: "No hay horario configurado para este día" });
      }

      // Reconstruir el timeslot con la fecha correcta
      const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const slotDuration = schedule.slotMinutes;
      const [startHour, startMin] = startTime.split(':').map(Number);
      const slotStart = new Date(targetDate);
      slotStart.setHours(startHour, startMin, 0, 0);
      const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);
      const endTime = `${slotEnd.getHours().toString().padStart(2, '0')}:${slotEnd.getMinutes().toString().padStart(2, '0')}`;

      // basePrice y priceOverride ya están en centavos según el schema
      const priceCents = schedule.priceOverride ?? court.basePrice;

      // Verificar si existe un timeslot real para esta fecha y hora
      const existingTimeslot = await prisma.timeslot.findFirst({
        where: {
          courtId: court.id,
          date: targetDate,
          startTime: startTime,
        },
        include: {
          court: {
            include: {
              club: true
            }
          }
        }
      });

      // Si existe un timeslot real, usarlo
      if (existingTimeslot) {
        return res.json({
          id: existingTimeslot.id,
          date: existingTimeslot.date.toISOString().split('T')[0],
          startTime: existingTimeslot.startTime,
          endTime: existingTimeslot.endTime,
          priceCents: existingTimeslot.priceCents,
          currency: existingTimeslot.currency,
          status: existingTimeslot.status,
          court: {
            id: existingTimeslot.court.id,
            name: existingTimeslot.court.name,
            surface: existingTimeslot.court.surface,
            indoor: existingTimeslot.court.indoor,
            club: {
              id: existingTimeslot.court.club.id,
              name: existingTimeslot.court.club.name,
              city: existingTimeslot.court.club.city,
              zone: existingTimeslot.court.club.zone,
            }
          }
        });
      }

      // Si no existe, devolver el generado
      return res.json({
        id: id,
        date: targetDate.toISOString().split('T')[0],
        startTime: startTime,
        endTime: endTime,
        priceCents: priceCents, // Ya está en centavos
        currency: court.currency || "MXN",
        status: "AVAILABLE",
        court: {
          id: court.id,
          name: court.name,
          surface: court.surface,
          indoor: court.indoor,
          club: {
            id: court.club.id,
            name: court.club.name,
            city: court.club.city,
            zone: court.club.zone,
          }
        }
      });
    }

    // Si es un timeslot real (UUID normal)
    const timeslot = await prisma.timeslot.findUnique({
      where: { id },
      include: {
        court: {
          include: {
            club: true
          }
        }
      }
    });

    if (!timeslot) {
      return res.status(404).json({ error: "Horario no encontrado" });
    }

    res.json({
      id: timeslot.id,
      date: timeslot.date.toISOString().split('T')[0],
      startTime: timeslot.startTime,
      endTime: timeslot.endTime,
      priceCents: timeslot.priceCents,
      currency: timeslot.currency,
      status: timeslot.status,
      court: {
        id: timeslot.court.id,
        name: timeslot.court.name,
        surface: timeslot.court.surface,
        indoor: timeslot.court.indoor,
        club: {
          id: timeslot.court.club.id,
          name: timeslot.court.club.name,
          city: timeslot.court.club.city,
          zone: timeslot.court.club.zone,
        }
      }
    });
  } catch (error) {
    console.error("Error en getTimeslotById:", error);
    res.status(500).json({ error: "Error al obtener el horario" });
  }
};