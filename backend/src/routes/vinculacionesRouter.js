import { Router } from 'express';
import { getAllVinculaciones } from '../controllers/vinculacionesController.js';

const router = Router()

router.get('/', getAllVinculaciones)

export default router