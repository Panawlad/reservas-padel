import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { createSchedule, getSchedulesByCourt } from "../controllers/schedule.controller";

const router = Router();

// Crear horario para una cancha (solo CLUB)
router.post("/create", verifyToken, authorizeRoles("CLUB"), createSchedule);

// Obtener horarios de una cancha
router.get("/:courtId", verifyToken, getSchedulesByCourt);

export default router;
