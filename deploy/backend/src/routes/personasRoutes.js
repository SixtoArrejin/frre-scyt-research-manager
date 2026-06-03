import { Router } from 'express';
import {
  getPersonas,
  createPersona,
  updatePersonaController,
  getPersonasById,
  getPersonasByGroup,
} from '../controllers/personasController.js';
import {
  validateToken,
  requirePermission,
} from '../middleware/authMiddleware.js';
import { RESOURCES, ACTIONS } from '../config/roles.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(validateToken);

// Rutas de lectura - todos los roles autenticados pueden ver personas
router.get(
  '/',
  requirePermission(RESOURCES.PERSONAS, ACTIONS.READ),
  getPersonas,
);
router.get(
  '/:idPersona',
  requirePermission(RESOURCES.PERSONAS, ACTIONS.READ),
  getPersonasById,
);
router.get(
  '/grupo/:idGrupo',
  requirePermission(RESOURCES.PERSONAS, ACTIONS.READ),
  getPersonasByGroup,
);

// Rutas de escritura - solo ADMIN y RRHH pueden crear/modificar personas
router.post(
  '/',
  requirePermission(RESOURCES.PERSONAS, ACTIONS.CREATE),
  createPersona,
);
router.put(
  '/:idPersona',
  requirePermission(RESOURCES.PERSONAS, ACTIONS.UPDATE),
  updatePersonaController,
);

export default router;
