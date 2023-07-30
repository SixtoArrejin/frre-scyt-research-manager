import { Router } from 'express';
import {getPersonas, createPersona, updatePersonaController} from '../controllers/personasController.js';
import { validateToken } from '../middleware/authMiddleware.js'; // Importa la función validateToken

const router = Router()

router.get('/', getPersonas)
router.post('/', validateToken, createPersona);
router.put('/:dni', validateToken, updatePersonaController);

export default router