import { Router } from 'express';
import { getProyectos, getProyectosDeGrupo, getProyectosDePersona } from '../controllers/proyectosController.js';

const router = Router();

router.get('/', getProyectos);
router.get('/grupo/:idGrupo', getProyectosDeGrupo);
router.get('/persona/:personaId', getProyectosDePersona);

export default router;
