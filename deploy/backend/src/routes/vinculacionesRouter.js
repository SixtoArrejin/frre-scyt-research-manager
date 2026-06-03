import { Router } from 'express';
import {
  getAllVinculaciones,
  getVinculacionesByProyectoId,
  getVinculacionById,
  createDesembolso,
  getDesembolsoById,
  updateDesembolso,
  updateVinculacion,
} from '../controllers/vinculacionesController.js';
import {
  validateToken,
  requirePermission,
} from '../middleware/authMiddleware.js';
import { RESOURCES, ACTIONS } from '../config/roles.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(validateToken);

// Rutas de lectura - todos los roles autenticados pueden ver vinculaciones
router.get(
  '/',
  requirePermission(RESOURCES.VINCULACIONES, ACTIONS.READ),
  getAllVinculaciones,
);
router.get(
  '/:idVinculacion',
  requirePermission(RESOURCES.VINCULACIONES, ACTIONS.READ),
  getVinculacionById,
);
router.get(
  '/proyecto/:idProyecto',
  requirePermission(RESOURCES.VINCULACIONES, ACTIONS.READ),
  getVinculacionesByProyectoId,
);
router.get(
  '/desembolsos/:idDesembolso',
  requirePermission(RESOURCES.VINCULACIONES, ACTIONS.READ),
  getDesembolsoById,
);

// Rutas de escritura - solo ADMIN y UVT pueden crear/modificar vinculaciones
router.put(
  '/:idVinculacion',
  requirePermission(RESOURCES.VINCULACIONES, ACTIONS.UPDATE),
  updateVinculacion,
);
router.post(
  '/desembolsos',
  requirePermission(RESOURCES.VINCULACIONES, ACTIONS.CREATE),
  createDesembolso,
);
router.put(
  '/desembolsos/:idDesembolso',
  requirePermission(RESOURCES.VINCULACIONES, ACTIONS.UPDATE),
  updateDesembolso,
);

export default router;
