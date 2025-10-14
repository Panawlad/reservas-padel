import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { prepareUSDC, confirmUSDC } from "../controllers/payment.controller";

const router = Router();

/**
 * 🔹 Preparar pago USDC
 * Body: { reservationId: string }
 */
router.post("/prepare", verifyToken, prepareUSDC);

/**
 * 🔹 Confirmar pago USDC
 * Body: { reservationId: string, signature: string }
 */
router.post("/confirm", verifyToken, confirmUSDC);

export default router;
