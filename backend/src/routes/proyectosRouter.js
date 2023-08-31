import { Router } from 'express';
import { getProyectos, getProyectosDeGrupo } from '../controllers/proyectosController.js';

const router = Router();

router.get('/', getProyectos);
router.get('/grupo/:idGrupo', getProyectosDeGrupo);

export default router;
