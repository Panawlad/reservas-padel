import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  createReservation,
  confirmReservation,
  cancelReservation,
  getUserReservations,
} from "../controllers/reservation.controller";

const router = Router();

/**
 * 🔹 Crear una reserva (solo usuarios)
 * Body: { timeslotId: string, paymentMethod?: "FIAT" | "USDC" }
 */
router.post("/create", verifyToken, createReservation);

/**
 * 🔹 Confirmar una reserva (cuando el pago se haya completado)
 * Body: { reservationId: string }
 */
router.post("/confirm", verifyToken, confirmReservation);

/**
 * 🔹 Cancelar una reserva pendiente
 * Body: { reservationId: string }
 */
router.post("/cancel", verifyToken, cancelReservation);

/**
 * 🔹 Obtener todas las reservas del usuario autenticado
 * Headers: Authorization: Bearer <token>
 */
router.get("/my", verifyToken, getUserReservations);

export default router;
