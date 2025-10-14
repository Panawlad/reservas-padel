import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import {
  createCourt,
  getCourts,
  getCourtById, // ✅ agregado correctamente
  updateCourt,
  deleteCourt,
} from "../controllers/court.controller";

const router = Router();

// Registrar cancha (solo CLUB)
router.post("/create", verifyToken, authorizeRoles("CLUB"), createCourt);

// Ver todas las canchas (ADMIN o CLUB)
router.get("/", verifyToken, getCourts);

// Obtener una cancha por su ID
router.get("/:id", verifyToken, getCourtById);

// Actualizar cancha
router.put("/:id", verifyToken, updateCourt);

// Eliminar cancha
router.delete("/:id", verifyToken, deleteCourt);

export default router;
