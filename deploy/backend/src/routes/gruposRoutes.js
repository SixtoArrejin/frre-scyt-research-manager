import { Router } from 'express';
import {getGrupos, getGruposById, updateGrupoController, createGrupo} from '../controllers/gruposController.js';
import { validateToken, requirePermission } from '../middleware/authMiddleware.js';
import { RESOURCES, ACTIONS } from '../config/roles.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(validateToken);

// Rutas de lectura - todos los roles autenticados pueden ver grupos
router.get(
  '/',
  requirePermission(RESOURCES.GRUPOS, ACTIONS.READ),
  getGrupos,
);
router.get(
  '/:idGrupoInvestigacion',
  requirePermission(RESOURCES.GRUPOS, ACTIONS.READ),
  getGruposById,
);

// Rutas de escritura - solo ADMIN y RRHH pueden crear/modificar grupos
router.post(
  '/',
  requirePermission(RESOURCES.GRUPOS, ACTIONS.CREATE),
  createGrupo,
);
router.put(
  '/:idGrupoInvestigacion',
  requirePermission(RESOURCES.GRUPOS, ACTIONS.UPDATE),
  updateGrupoController,
);

export default router;