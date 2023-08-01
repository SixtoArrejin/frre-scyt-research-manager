import { Router } from 'express';
import {getPersonas, createPersona, updatePersonaController, getPersonasById} from '../controllers/personasController.js';
import { validateToken } from '../middleware/authMiddleware.js'; // Importa la función validateToken

const router = Router()

router.get('/', getPersonas)
router.get('/:idPersona', getPersonasById)
router.post('/', validateToken, createPersona);
router.put('/:idPersona', validateToken, updatePersonaController);

export default router