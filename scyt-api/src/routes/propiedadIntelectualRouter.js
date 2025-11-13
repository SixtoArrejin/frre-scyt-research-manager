import { Router } from 'express';
import {
  getAllPropiedadIntelectual,
  getPropiedadIntelectualByProyectoId,
  getPropiedadIntelectualById,
  createPropiedadIntelectual,
  updatePropiedadIntelectual,
  deletePropiedadIntelectual,
} from '../controllers/propiedadIntelectualController.js';
import {
  validateToken,
  requirePermission,
} from '../middleware/authMiddleware.js';
import { RESOURCES, ACTIONS } from '../config/roles.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(validateToken);

// Rutas de lectura - todos los roles autenticados pueden ver PI
router.get(
  '/',
  requirePermission(RESOURCES.PROPIEDAD_INTELECTUAL, ACTIONS.READ),
  getAllPropiedadIntelectual,
);
router.get(
  '/:idPI',
  requirePermission(RESOURCES.PROPIEDAD_INTELECTUAL, ACTIONS.READ),
  getPropiedadIntelectualById,
);
router.get(
  '/proyecto/:idProyecto',
  requirePermission(RESOURCES.PROPIEDAD_INTELECTUAL, ACTIONS.READ),
  getPropiedadIntelectualByProyectoId,
);

// Rutas de escritura - solo ADMIN y UVT pueden crear/modificar PI
router.post(
  '/',
  requirePermission(RESOURCES.PROPIEDAD_INTELECTUAL, ACTIONS.CREATE),
  createPropiedadIntelectual,
);
router.put(
  '/:idPI',
  requirePermission(RESOURCES.PROPIEDAD_INTELECTUAL, ACTIONS.UPDATE),
  updatePropiedadIntelectual,
);
router.delete(
  '/:idPI',
  requirePermission(RESOURCES.PROPIEDAD_INTELECTUAL, ACTIONS.DELETE),
  deletePropiedadIntelectual,
);

export default router;
