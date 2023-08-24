import { Router } from 'express';
import { getProyectos } from '../controllers/proyectosController.js';

const router = Router();

router.get('/', getProyectos);

export default router;
