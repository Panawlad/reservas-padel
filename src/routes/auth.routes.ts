import { Router } from "express";
import { signup, login, getAllUsers, me } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", getAllUsers);
router.get("/me", verifyToken, me);

export default router;
