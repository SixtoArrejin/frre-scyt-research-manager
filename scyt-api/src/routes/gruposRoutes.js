import { Router } from 'express';
import {getGrupos, getGruposById, updateGrupoController, createGrupo} from '../controllers/gruposController.js';
import { validateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getGrupos);
router.get('/:idGrupoInvestigacion', getGruposById);
router.put('/:idGrupoInvestigacion',validateToken, updateGrupoController);
router.post('/', createGrupo);

export default router;