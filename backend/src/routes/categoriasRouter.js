import { Router } from 'express';
import { getCategoriaById, createCategoria, deleteCategoria } from '../controllers/categoriasController.js';
import { validateToken } from '../middleware/authMiddleware.js'; // Importa la función validateToken

const router = Router()

router.get('/:idCategoria', getCategoriaById)
router.post('/', validateToken, createCategoria);
router.delete('/:idCategoria', validateToken, deleteCategoria);

export default router