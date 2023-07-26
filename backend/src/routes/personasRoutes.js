import { Router } from 'express'
import {getPersonas} from '../controllers/personasController.js'

const router = Router()

router.get('/', getPersonas)

export default router