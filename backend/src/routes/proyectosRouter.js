import { Router } from 'express';
import {
    getProyectos,
    getProyectosDeGrupo,
    getProyectosDePersona,
    getProyectoPorId,
    crearProyectosPID,
} from '../controllers/proyectosController.js';

const router = Router();

router.get('/', getProyectos);
router.get('/grupo/:idGrupo', getProyectosDeGrupo);
router.get('/persona/:personaId', getProyectosDePersona);
router.get('/:idProyecto', getProyectoPorId)

router.post('/pid', crearProyectosPID);

export default router;
