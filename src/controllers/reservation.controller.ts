import { Request, Response } from "express";
import { prisma } from "../db";

/**
 * Crear una nueva reserva
 * - Solo los usuarios pueden crear reservas.
 * - El horario debe estar disponible.
 * - Se crea la reserva con estado PENDING.
 */
export const createReservation = async (req: Request, res: Response) => {
  try {
    const { timeslotId, paymentMethod } = req.body;
    const userId = (req as any).userId;
    const role = (req as any).role;

    if (role !== "USER") {
      return res.status(403).json({ error: "Solo los usuarios pueden crear reservas." });
    }

    let timeslot: any = null;

    // Si es un timeslot generado dinámicamente, necesitamos crearlo primero
    if (timeslotId.startsWith('generated-')) {
      // Extraer courtId y timestamp del ID generado
      const lastDashIndex = timeslotId.lastIndexOf('-');
      const timestampPart = timeslotId.substring(lastDashIndex + 1);
      const courtIdPart = timeslotId.substring('generated-'.length, lastDashIndex);
      
      const courtId = courtIdPart;
      const timestamp = parseInt(timestampPart);

      if (!courtId || isNaN(timestamp)) {
        return res.status(400).json({ error: "ID de timeslot generado inválido." });
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
        return res.status(404).json({ error: "Cancha no encontrada." });
      }

      // Extraer la hora del timestamp (el timestamp es relativo a 2000-01-01)
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
        return res.status(404).json({ error: "No hay horario configurado para este día." });
      }

      // Reconstruir el timeslot
      const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const slotDuration = schedule.slotMinutes;
      const [startHour, startMin] = startTime.split(':').map(Number);
      const slotStart = new Date(targetDate);
      slotStart.setHours(startHour, startMin, 0, 0);
      const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);
      const endTime = `${slotEnd.getHours().toString().padStart(2, '0')}:${slotEnd.getMinutes().toString().padStart(2, '0')}`;

      // basePrice y priceOverride ya están en centavos según el schema
      const priceCents = schedule.priceOverride ?? court.basePrice;

      // Verificar si ya existe un timeslot real para esta fecha y hora
      let existingTimeslot = await prisma.timeslot.findFirst({
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

      // Si no existe, crearlo
      if (!existingTimeslot) {
        existingTimeslot = await prisma.timeslot.create({
          data: {
            date: targetDate,
            startTime: startTime,
            endTime: endTime,
            priceCents: priceCents, // Ya está en centavos
            currency: court.currency || "MXN",
            status: "AVAILABLE",
            courtId: court.id,
            clubId: court.clubId,
          },
          include: {
            court: {
              include: {
                club: true
              }
            }
          }
        });
      }

      timeslot = existingTimeslot;
    } else {
      // Si es un timeslot real, buscarlo en la BD
      timeslot = await prisma.timeslot.findUnique({
        where: { id: timeslotId },
        include: { court: { include: { club: true } } },
      });

      if (!timeslot) {
        return res.status(404).json({ error: "Horario no encontrado." });
      }
    }

    if (timeslot.status !== "AVAILABLE") {
      return res.status(400).json({ error: "El horario no está disponible." });
    }

    // Calcular comisiones automáticamente
    const commission = await prisma.commission.findFirst({
      where: { isActive: true },
      orderBy: { effectiveFrom: 'desc' },
    });

    const platformFeeBps = commission?.platformFeeBps || 1000; // 10%
    const clubFeeBps = commission?.clubFeeBps || 9000; // 90%

    const platformFeeCents = Math.round((timeslot.priceCents * platformFeeBps) / 10000);
    const clubFeeCents = timeslot.priceCents - platformFeeCents;

    // Crear reserva (no bloquear el horario todavía)
    // Usar el ID real del timeslot (puede ser el creado o el encontrado)
    // Usar timeslot.clubId directamente ya que el timeslot tiene ese campo
    const clubId = timeslot.clubId || timeslot.court?.clubId;
    
    if (!clubId) {
      console.error("Error: No se pudo determinar clubId", { timeslot });
      return res.status(500).json({ error: "Error al crear la reserva: información de club no disponible." });
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        courtId: timeslot.courtId,
        clubId: clubId,
        timeslotId: timeslot.id, // Usar el ID real del timeslot, no el generado
        totalCents: timeslot.priceCents,
        currency: timeslot.currency,
        paymentMethod: paymentMethod || "FIAT",
        status: "PENDING",
        platformFeeCents,
        clubFeeCents,
        commissionId: commission?.id,
      },
      include: {
        court: true,
        timeslot: true,
      },
    });

    res.status(201).json({
      message: "Reserva creada exitosamente.",
      reservation,
    });
  } catch (error: any) {
    console.error("Error en createReservation:", error);
    console.error("Stack trace:", error?.stack);
    // Si es un error de Prisma, dar más detalles
    if (error?.code) {
      console.error("Prisma error code:", error.code);
    }
    res.status(500).json({ 
      error: "Error al crear la reserva.",
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
};

/**
 * Confirmar una reserva (ej. después de un pago USDC confirmado)
 */
export const confirmReservation = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.body;
    const userId = (req as any).userId;

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation || reservation.userId !== userId) {
      return res.status(403).json({ error: "No tienes permiso para confirmar esta reserva." });
    }

    const updated = await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "PAID" },
    });

    // Asegurar que el horario quede reservado al confirmar manualmente
    await prisma.timeslot.update({
      where: { id: updated.timeslotId },
      data: { status: "RESERVED" },
    });

    res.json({
      message: "Reserva confirmada (pago recibido).",
      reservation: updated,
    });
  } catch (error) {
    console.error("Error en confirmReservation:", error);
    res.status(500).json({ error: "Error al confirmar la reserva." });
  }
};

/**
 * Cancelar una reserva (solo si está pendiente)
 */
export const cancelReservation = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.body;
    const userId = (req as any).userId;

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation || reservation.userId !== userId) {
      return res.status(403).json({ error: "No puedes cancelar esta reserva." });
    }

    if (reservation.status === "PAID") {
      return res.status(400).json({ error: "No puedes cancelar una reserva ya pagada." });
    }

    // Liberar el horario antes de eliminar
    await prisma.timeslot.update({
      where: { id: reservation.timeslotId },
      data: { status: "AVAILABLE" },
    });

    await prisma.reservation.delete({ where: { id: reservationId } });

    res.json({ message: "Reserva cancelada y horario liberado." });
  } catch (error) {
    console.error("Error en cancelReservation:", error);
    res.status(500).json({ error: "Error al cancelar la reserva." });
  }
};

/**
 * Obtener todas las reservas de un usuario
 */
export const getUserReservations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: {
        court: { include: { club: true } },
        timeslot: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(reservations);
  } catch (error) {
    console.error("Error en getUserReservations:", error);
    res.status(500).json({ error: "Error al obtener reservas del usuario." });
  }
};

/**
 * Obtener una reserva por ID (solo el dueño puede verla)
 */
export const getReservationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        court: { 
          include: { 
            club: true 
          } 
        },
        timeslot: true,
        payment: true,
      },
    });

    if (!reservation) {
      return res.status(404).json({ error: "Reserva no encontrada." });
    }

    // Solo el dueño puede ver su reserva
    if (reservation.userId !== userId) {
      return res.status(403).json({ error: "No tienes permiso para ver esta reserva." });
    }

    res.json(reservation);
  } catch (error) {
    console.error("Error en getReservationById:", error);
    res.status(500).json({ error: "Error al obtener la reserva." });
  }
};
