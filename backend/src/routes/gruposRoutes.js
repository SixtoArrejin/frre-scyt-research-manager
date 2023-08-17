import { Router } from 'express'
import {getGrupos, getGruposById} from '../controllers/gruposController.js'

const router = Router()

router.get('/', getGrupos)
router.get('/:idGrupoInvestigacion', getGruposById)

export default router