import { Router } from 'express'
import {getPersonas, createPersona, updatePersonaController} from '../controllers/personasController.js'

const router = Router()

router.get('/', getPersonas)
router.post('/', createPersona);
router.put('/:dni', updatePersonaController);

export default router