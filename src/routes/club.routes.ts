import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deactivateClub,
  getMyClub,
  getClubEarnings,
} from "../controllers/club.controller";

const router = Router();

// ✅ Crear club → solo ADMIN
router.post("/create", verifyToken, authorizeRoles("ADMIN"), createClub);

// ✅ Ver todos los clubes → solo ADMIN
router.get("/", verifyToken, getAllClubs);

// ✅ Ver mi club → solo CLUB
router.get("/my-club", verifyToken, authorizeRoles("CLUB"), getMyClub);

// ✅ Estadísticas de ingresos del club → solo CLUB
router.get("/earnings", verifyToken, authorizeRoles("CLUB"), getClubEarnings);

// ✅ Ver un club específico → Cualquier usuario autenticado
router.get("/:id", verifyToken, getClubById);

// ✅ Actualizar club → ADMIN o CLUB propietario
router.put("/:id", verifyToken, updateClub);

// ✅ Desactivar club → solo ADMIN
router.patch("/:id/deactivate", verifyToken, authorizeRoles("ADMIN"), deactivateClub);

export default router;
