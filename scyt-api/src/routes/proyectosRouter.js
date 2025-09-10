import { Router } from "express";
import {
  getProyectos,
  getProyectosDeGrupo,
  getProyectosDePersona,
  getProyectoPorId,
  crearProyectos,
  crearVinculaciones,
  updateProyectoController,
  addInvestigador,
  delInvestigador,
  addGrupo,
  delGrupo,
} from "../controllers/proyectosController.js";
import {
  validateToken,
  requirePermission,
} from "../middleware/authMiddleware.js";
import { RESOURCES, ACTIONS } from "../config/roles.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(validateToken);

// Rutas de lectura - todos los roles autenticados pueden ver proyectos
router.get(
  "/",
  requirePermission(RESOURCES.PROYECTOS, ACTIONS.READ),
  getProyectos
);
router.get(
  "/grupo/:idGrupo",
  requirePermission(RESOURCES.PROYECTOS, ACTIONS.READ),
  getProyectosDeGrupo
);
router.get(
  "/persona/:personaId",
  requirePermission(RESOURCES.PROYECTOS, ACTIONS.READ),
  getProyectosDePersona
);
router.get(
  "/:idProyecto",
  requirePermission(RESOURCES.PROYECTOS, ACTIONS.READ),
  getProyectoPorId
);

// Rutas de escritura - solo ADMIN y PID pueden crear/modificar proyectos
router.post(
  "/",
  requirePermission(RESOURCES.PROYECTOS, ACTIONS.CREATE),
  crearProyectos
);
router.put(
  "/:idProyecto",
  requirePermission(RESOURCES.PROYECTOS, ACTIONS.UPDATE),
  updateProyectoController
);
router.post(
  "/:idProyecto/investigador",
  requirePermission(RESOURCES.PROYECTOS, ACTIONS.UPDATE),
  addInvestigador
);
router.delete(
  "/:idProyecto/investigador/:idInvestigador",
  requirePermission(RESOURCES.PROYECTOS, ACTIONS.UPDATE),
  delInvestigador
);
router.post(
  "/:idProyecto/grupo",
  requirePermission(RESOURCES.PROYECTOS, ACTIONS.UPDATE),
  addGrupo
);
router.delete(
  "/:idProyecto/grupo/:idGrupo",
  requirePermission(RESOURCES.PROYECTOS, ACTIONS.UPDATE),
  delGrupo
);

// Vinculaciones son manejadas por UVT
router.post(
  "/:idProyecto/vinculaciones",
  requirePermission(RESOURCES.VINCULACIONES, ACTIONS.CREATE),
  crearVinculaciones
);

export default router;
