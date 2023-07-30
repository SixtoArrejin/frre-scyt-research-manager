import { Router } from 'express'
import {getUsuarios, createUsuario, login} from '../controllers/usuariosController.js'
import { validateToken } from '../middleware/authMiddleware.js'; // Importa la función validateToken

const router = Router()

router.get('/', getUsuarios)
router.post('/', validateToken, createUsuario)
router.post('/login', login);

export default router