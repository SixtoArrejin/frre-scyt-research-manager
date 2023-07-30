import { Router } from 'express'
import {getUsuarios} from '../controllers/usuariosController.js'

const router = Router()

router.get('/', getUsuarios)

export default router