import { Router } from 'express'
import {getGrupos, getGruposById, updateGrupoController} from '../controllers/gruposController.js'
import { validateToken } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', getGrupos)
router.get('/:idGrupoInvestigacion', getGruposById)
router.put('/:idGrupoInvestigacion', updateGrupoController)

export default router