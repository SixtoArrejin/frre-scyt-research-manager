import { Router } from "express";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  login,
  getRoles,
  getProfile,
} from "../controllers/usuariosController.js";
import {
  validateToken,
  requirePermission,
} from "../middleware/authMiddleware.js";
import { RESOURCES, ACTIONS } from "../config/roles.js";

const router = Router();

// Rutas públicas
router.post("/login", login);
router.get("/roles", getRoles); // Para que el frontend pueda conocer los roles disponibles

// Rutas protegidas
router.get(
  "/",
  validateToken,
  requirePermission(RESOURCES.USUARIOS, ACTIONS.READ),
  getUsuarios
);
router.post(
  "/",
  validateToken,
  requirePermission(RESOURCES.USUARIOS, ACTIONS.CREATE),
  createUsuario
);
router.put(
  "/:usuario",
  validateToken,
  requirePermission(RESOURCES.USUARIOS, ACTIONS.UPDATE),
  updateUsuario
);
router.delete(
  "/:usuario",
  validateToken,
  requirePermission(RESOURCES.USUARIOS, ACTIONS.DELETE),
  deleteUsuario
);
router.get("/profile/me", validateToken, getProfile); // Ruta especial para obtener el perfil propio

export default router;
