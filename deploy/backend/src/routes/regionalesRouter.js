import { Router } from 'express';
import { getAllRegionales } from '../controllers/regionalesController.js';
import { validateToken } from '../middleware/authMiddleware.js'; // Importa la función validateToken

const router = Router();

router.get('/', getAllRegionales);

export default router;