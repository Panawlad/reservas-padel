import { Request, Response } from "express";
import { prisma } from "../db";

/**
 * Calcular comisiones para una reserva
 */
export const calculateCommission = async (req: Request, res: Response) => {
  try {
    const { reservationId, totalCents } = req.body;

    // Obtener la comisión activa (por defecto 10% plataforma, 90% club)
    const commission = await prisma.commission.findFirst({
      where: { isActive: true },
      orderBy: { effectiveFrom: 'desc' },
    });

    const platformFeeBps = commission?.platformFeeBps || 1000; // 10%
    const clubFeeBps = commission?.clubFeeBps || 9000; // 90%

    // Calcular comisiones
    const platformFeeCents = Math.round((totalCents * platformFeeBps) / 10000);
    const clubFeeCents = totalCents - platformFeeCents;

    res.json({
      platformFeeCents,
      clubFeeCents,
      platformFeeBps,
      clubFeeBps,
      commissionId: commission?.id,
    });
  } catch (error) {
    console.error("Error calculando comisión:", error);
    res.status(500).json({ error: "Error calculando comisión" });
  }
};

/**
 * Obtener estadísticas de comisiones
 */
export const getCommissionStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereClause: any = {
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
      totalRevenue,
      platformRevenue,
      clubRevenue,
      totalReservations,
      averageReservationValue: totalReservations > 0 ? Math.round(totalRevenue / totalReservations) : 0,
      platformPercentage: totalRevenue > 0 ? Math.round((platformRevenue / totalRevenue) * 100) : 0,
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({ error: "Error obteniendo estadísticas" });
  }
};

/**
 * Obtener estadísticas por club
 */
export const getClubCommissionStats = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const { startDate, endDate } = req.query;
    
    const whereClause: any = {
      clubId,
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

    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { name: true, city: true, zone: true },
    });

    res.json({
      club,
      totalRevenue: stats._sum.totalCents || 0,
      platformRevenue: stats._sum.platformFeeCents || 0,
      clubRevenue: stats._sum.clubFeeCents || 0,
      totalReservations: stats._count.id || 0,
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas del club:", error);
    res.status(500).json({ error: "Error obteniendo estadísticas del club" });
  }
};

/**
 * Actualizar configuración de comisiones
 */
export const updateCommissionConfig = async (req: Request, res: Response) => {
  try {
    const { platformFeeBps, clubFeeBps } = req.body;

    if (platformFeeBps + clubFeeBps !== 10000) {
      return res.status(400).json({ 
        error: "La suma de comisiones debe ser 100% (10000 basis points)" 
      });
    }

    // Desactivar comisiones anteriores
    await prisma.commission.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Crear nueva configuración
    const newCommission = await prisma.commission.create({
      data: {
        platformFeeBps,
        clubFeeBps,
        isActive: true,
      },
    });

    res.json({
      message: "Configuración de comisiones actualizada",
      commission: newCommission,
    });
  } catch (error) {
    console.error("Error actualizando comisiones:", error);
    res.status(500).json({ error: "Error actualizando comisiones" });
  }
};
