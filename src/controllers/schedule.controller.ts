import { Request, Response } from "express";
import { prisma } from "../db";

/**
 * Crear horario semanal para una cancha (solo CLUB)
 */
export const createSchedule = async (req: Request, res: Response) => {
  try {
    console.log("=== CREATE SCHEDULE DEBUG ===");
    console.log("Request body:", req.body);
    console.log("User ID:", (req as any).userId);
    console.log("User role:", (req as any).role);

    const { courtId, weekday, openTime, closeTime, slotMinutes, priceOverride } = req.body;
    const userId = (req as any).userId;
    const role = (req as any).role;

    // Validaciones básicas
    if (!courtId || !weekday || !openTime || !closeTime) {
      return res.status(400).json({ 
        error: "Faltan campos obligatorios: courtId, weekday, openTime, closeTime" 
      });
    }

    if (role !== "CLUB") {
      return res.status(403).json({ error: "Solo los clubes pueden crear horarios" });
    }

    console.log("Buscando cancha con ID:", courtId);
    
    // Verifica que la cancha le pertenezca al club actual
    const court = await prisma.court.findUnique({
      where: { id: courtId },
      include: { club: true },
    });

    console.log("Cancha encontrada:", court);

    if (!court) {
      return res.status(404).json({ error: "Cancha no encontrada" });
    }

    if (court.club.ownerId !== userId) {
      return res.status(403).json({ error: "No puedes modificar canchas que no son tuyas" });
    }

    console.log("Creando horario con datos:", {
      courtId,
      clubId: court.clubId,
      weekday,
      openTime,
      closeTime,
      slotMinutes: slotMinutes || 60,
      priceOverride: priceOverride || null
    });

    const schedule = await prisma.schedule.create({
      data: {
        courtId,
        clubId: court.clubId,
        weekday,
        openTime,
        closeTime,
        slotMinutes: slotMinutes || 60,
        priceOverride: priceOverride || null,
      },
    });

    console.log("Horario creado exitosamente:", schedule);

    res.status(201).json({ message: "Horario creado correctamente", schedule });
  } catch (error) {
    console.error("Error en createSchedule:", error);
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
      res.status(500).json({ 
        error: "Error al crear el horario",
        details: error.message 
      });
    } else {
      res.status(500).json({ 
        error: "Error al crear el horario",
        details: "Error desconocido"
      });
    }
  }
};

/**
 * Obtener horarios de una cancha
 */
export const getSchedulesByCourt = async (req: Request, res: Response) => {
  try {
    const { courtId } = req.params;
    console.log("=== GET SCHEDULES DEBUG ===");
    console.log("Court ID:", courtId);

    const schedules = await prisma.schedule.findMany({
      where: { courtId },
      orderBy: { weekday: "asc" },
    });

    console.log("Horarios encontrados:", schedules);
    res.json(schedules);
  } catch (error) {
    console.error("Error en getSchedulesByCourt:", error);
    if (error instanceof Error) {
      res.status(500).json({ 
        error: "Error al obtener los horarios",
        details: error.message 
      });
    } else {
      res.status(500).json({ 
        error: "Error al obtener los horarios",
        details: "Error desconocido"
      });
    }
  }
};
