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

    const timeslot = await prisma.timeslot.findUnique({
      where: { id: timeslotId },
      include: { court: { include: { club: true } } },
    });

    if (!timeslot) {
      return res.status(404).json({ error: "Horario no encontrado." });
    }

    if (timeslot.status !== "AVAILABLE") {
      return res.status(400).json({ error: "El horario no está disponible." });
    }

    // Crear reserva
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        courtId: timeslot.courtId,
        clubId: timeslot.court.clubId,
        timeslotId,
        totalCents: timeslot.priceCents,
        currency: timeslot.currency,
        paymentMethod: paymentMethod || "FIAT",
        status: "PENDING",
      },
      include: {
        court: true,
        timeslot: true,
      },
    });

    // Cambiar el estado del horario a RESERVED
    await prisma.timeslot.update({
      where: { id: timeslotId },
      data: { status: "RESERVED" },
    });

    res.status(201).json({
      message: "Reserva creada exitosamente.",
      reservation,
    });
  } catch (error) {
    console.error("Error en createReservation:", error);
    res.status(500).json({ error: "Error al crear la reserva." });
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
