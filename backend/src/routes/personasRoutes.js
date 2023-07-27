import { Router } from 'express'
import {getPersonas, createPersona} from '../controllers/personasController.js'

const router = Router()

router.get('/', getPersonas)
router.post('/', createPersona);

export default router