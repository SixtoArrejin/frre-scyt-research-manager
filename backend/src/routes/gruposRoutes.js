import { Router } from 'express'
import {getGrupos} from '../controllers/gruposController.js'

const router = Router()

router.get('/', getGrupos)

export default router