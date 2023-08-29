import { Router } from 'express';
import { getProyectos, getProyectosDeGrupo } from '../controllers/proyectosController.js';

const router = Router();

router.get('/', getProyectos);
router.get('/grupos/', getProyectosDeGrupo);

export default router;
