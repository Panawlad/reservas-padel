import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import upload from "../middleware/upload.middleware";
import {
  createClub,
  createMyClub,
  getAllClubs,
  getClubById,
  updateClub,
  deactivateClub,
  getMyClub,
  getClubEarnings,
  uploadClubImages,
} from "../controllers/club.controller";

const router = Router();

// ✅ Crear club → solo ADMIN
router.post("/create", verifyToken, authorizeRoles("ADMIN"), createClub);

// ✅ Crear mi club → solo CLUB
router.post("/", verifyToken, authorizeRoles("CLUB"), createMyClub);

// ✅ Ver todos los clubes → solo ADMIN
router.get("/", verifyToken, getAllClubs);

// ✅ Ver todos los clubes → Público (sin autenticación)
router.get("/public", getAllClubs);

// ✅ Ver mi club → solo CLUB
router.get("/my-club", verifyToken, authorizeRoles("CLUB"), getMyClub);

// ✅ Estadísticas de ingresos del club → solo CLUB
router.get("/earnings", verifyToken, authorizeRoles("CLUB"), getClubEarnings);

// ✅ Ver un club específico → Cualquier usuario autenticado
router.get("/:id", verifyToken, getClubById);

// ✅ Ver un club específico → Público (sin autenticación)
router.get("/public/:id", getClubById);

// ✅ Actualizar club → ADMIN o CLUB propietario
router.put("/:id", verifyToken, updateClub);

// ✅ Desactivar club → solo ADMIN
router.patch("/:id/deactivate", verifyToken, authorizeRoles("ADMIN"), deactivateClub);

// ✅ Subir imágenes del club
router.post("/:clubId/images", verifyToken, authorizeRoles("CLUB", "ADMIN"), upload.array('clubImages', 5), uploadClubImages);

export default router;
