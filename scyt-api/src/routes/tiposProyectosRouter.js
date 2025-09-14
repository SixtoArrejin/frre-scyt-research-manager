import { Router } from 'express';
import { getAllTiposProyectos } from '../controllers/tiposProyectosController.js';

const router = Router();

router.get('/', getAllTiposProyectos);

export default router;