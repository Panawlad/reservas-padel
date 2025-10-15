import { Request, Response } from "express";
import { prisma } from "../db";
import { v4 as uuidv4 } from "uuid";
import { Connection, PublicKey } from "@solana/web3.js";
import { PaymentStatus } from "@prisma/client";

// Variables del entorno (.env)
const SOLANA_RPC = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
const USDC_MINT = process.env.USDC_MINT_ADDRESS || "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const PLATFORM_WALLET = process.env.PLATFORM_USDC_WALLET!;

/**
 * 🔹 PREPARAR PAGO USDC
 * - Crea un registro Payment en estado PENDING.
 * - Calcula el monto en USDC (ejemplo: 18 MXN = 1 USDC).
 * - Devuelve la información necesaria para que el frontend genere la transacción.
 */
export const prepareUSDC = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.body;
    const userId = (req as any).userId;

    // Verifica que la reserva existe y pertenece al usuario
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { user: true },
    });

    if (!reservation || reservation.userId !== userId) {
      return res.status(403).json({ error: "No autorizado para esta reserva." });
    }

    if (reservation.status !== "PENDING") {
      return res.status(400).json({ error: "Esta reserva ya fue pagada o cancelada." });
    }

    // Conversión: de MXN a USDC (tasa estimada: 18 MXN = 1 USDC)
    const usdcAmount = reservation.totalCents / 100 / 18;
    const reference = uuidv4();

    // Crear registro de pago pendiente con división automática
    const payment = await prisma.payment.create({
      data: {
        reservationId,
        method: "USDC",
        amountCents: reservation.totalCents,
        currency: "MXN",
        provider: "solana",
        providerRef: reference, // UUID temporal hasta que se confirme
        status: "PENDING",
        // Campos de división automática
        platformFeeCents: reservation.platformFeeCents,
        clubFeeCents: reservation.clubFeeCents,
        network: "devnet",
        usdcAmount,
      },
    });

    return res.status(201).json({
      message: "Pago USDC preparado correctamente.",
      payment: {
        id: payment.id,
        reference,
        reservationId,
        usdcAmount,
        receiver: PLATFORM_WALLET,
        usdcMint: USDC_MINT,
        network: payment.network,
      },
    });
  } catch (error) {
    console.error("Error en prepareUSDC:", error);
    res.status(500).json({ error: "Error al preparar el pago." });
  }
};

/**
 * 🔹 CONFIRMAR PAGO USDC
 * - Verifica la transacción en la blockchain Solana.
 * - Si es válida, actualiza Payment → CONFIRMED y Reservation → PAID.
 */
export const confirmUSDC = async (req: Request, res: Response) => {
  try {
    const { reservationId, signature } = req.body;
    const userId = (req as any).userId;

    // Busca la reserva con su pago asociado
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { payment: true },
    });

    if (!reservation || reservation.userId !== userId) {
      return res.status(403).json({ error: "No autorizado para confirmar esta reserva." });
    }

    const payment = reservation.payment;
    if (!payment) {
      return res.status(404).json({ error: "No se encontró el registro de pago." });
    }

    // Conexión a la red Solana
    const connection = new Connection(SOLANA_RPC, "confirmed");

    const tx = await connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      return res.status(400).json({ error: "Transacción no encontrada en la red Solana." });
    }

    // ⚠️ Validaciones opcionales (recomendadas):
    // - receptor == PLATFORM_WALLET
    // - mint == USDC_MINT
    // - monto ≈ payment.usdcAmount

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.CONFIRMED,
        providerRef: signature, // guardamos el hash real de la transacción
      },
    });

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "PAID" },
    });

    // Al confirmar el pago, bloquear definitivamente el horario
    await prisma.timeslot.update({
      where: { id: reservation.timeslotId },
      data: { status: "RESERVED" },
    });

    res.json({
      message: "Pago USDC confirmado exitosamente.",
      reservationId,
      signature,
    });
  } catch (error) {
    console.error("Error en confirmUSDC:", error);
    res.status(500).json({ error: "Error al confirmar el pago." });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        reservation: {
          include: {
            user: true,
            club: true,
            court: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(payments);
  } catch (error) {
    console.error("Error en getAllPayments:", error);
    res.status(500).json({ error: "Error al obtener pagos" });
  }
};