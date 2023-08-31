import { Router } from 'express';
import {
    getProyectos,
    getProyectosDeGrupo,
    getProyectosDePersona,
    getProyectoPorId,
} from '../controllers/proyectosController.js';

const router = Router();

router.get('/', getProyectos);
router.get('/grupo/:idGrupo', getProyectosDeGrupo);
router.get('/persona/:personaId', getProyectosDePersona);
router.get('/:idProyecto', getProyectoPorId)

export default router;
