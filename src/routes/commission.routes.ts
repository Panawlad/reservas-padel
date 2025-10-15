import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import {
  calculateCommission,
  getCommissionStats,
  getClubCommissionStats,
  updateCommissionConfig,
} from "../controllers/commission.controller";

const router = Router();

// ✅ Calcular comisiones → ADMIN o CLUB
router.post("/calculate", verifyToken, calculateCommission);

// ✅ Estadísticas globales → solo ADMIN
router.get("/stats", verifyToken, authorizeRoles("ADMIN"), getCommissionStats);

// ✅ Estadísticas por club → ADMIN o CLUB propietario
router.get("/club/:clubId", verifyToken, getClubCommissionStats);

// ✅ Actualizar configuración → solo ADMIN
router.put("/config", verifyToken, authorizeRoles("ADMIN"), updateCommissionConfig);

export default router;
