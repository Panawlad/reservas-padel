import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import {
  generateTimeslots,
  getAvailableTimeslots,
  getTimeslotsByCourt,
} from "../controllers/timeslot.controller";

const router = Router();

// Generar automáticamente los timeslots (solo CLUB o ADMIN)
router.post("/generate", verifyToken, authorizeRoles("CLUB", "ADMIN"), generateTimeslots);

// Obtener todos los timeslots disponibles de una cancha (por query)
router.get("/", verifyToken, getAvailableTimeslots);

// ✅ Obtener los horarios de una cancha específica
router.get("/court/:id", verifyToken, getTimeslotsByCourt);

export default router;
