import { Router } from 'express';
import {getPersonas, createPersona, updatePersonaController, getPersonasById, getPersonasByGroup} from '../controllers/personasController.js';
import { validateToken } from '../middleware/authMiddleware.js'; // Importa la función validateToken

const router = Router()

router.get('/', getPersonas)
router.get('/:idPersona', getPersonasById)
router.get('/grupo/:idGrupo', getPersonasByGroup)
router.post('/', validateToken, createPersona);
router.put('/:idPersona', validateToken, updatePersonaController);

export default router