import { Router } from 'express';
import { createCategoria } from '../controllers/categoriasController.js';
import { validateToken } from '../middleware/authMiddleware.js'; // Importa la función validateToken

const router = Router()

router.post('/', createCategoria);

export default router