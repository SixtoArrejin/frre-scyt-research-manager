import { Router } from 'express';
import {
    getProyectos,
    getProyectosDeGrupo,
    getProyectosDePersona,
    getProyectoPorId,
    crearProyectos,
    crearVinculaciones,
    updateProyectoController,
} from '../controllers/proyectosController.js';

const router = Router();

router.get('/', getProyectos);
router.get('/grupo/:idGrupo', getProyectosDeGrupo);
router.get('/persona/:personaId', getProyectosDePersona);
router.get('/:idProyecto', getProyectoPorId)

router.post('/', crearProyectos);
router.post('/:idProyecto/vinculaciones', crearVinculaciones);
router.put('/:idProyecto', updateProyectoController);

export default router;
