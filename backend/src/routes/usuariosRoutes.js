import { Router } from 'express'
import {getUsuarios, createUsuario} from '../controllers/usuariosController.js'

const router = Router()

router.get('/', getUsuarios)
router.post('/', createUsuario)

export default router