import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deactivateClub,
} from "../controllers/club.controller";

const router = Router();

// ✅ Crear club → solo ADMIN
router.post("/create", verifyToken, authorizeRoles("ADMIN"), createClub);

// ✅ Ver todos los clubes → solo ADMIN
router.get("/", verifyToken, getAllClubs);

// ✅ Ver un club específico → ADMIN o CLUB propietario
router.get("/:id", verifyToken, getClubById);

// ✅ Actualizar club → ADMIN o CLUB propietario
router.put("/:id", verifyToken, updateClub);

// ✅ Desactivar club → solo ADMIN
router.patch("/:id/deactivate", verifyToken, authorizeRoles("ADMIN"), deactivateClub);

export default router;
