import { Router } from 'express';
import {
    getProyectos,
    getProyectosDeGrupo,
    getProyectosDePersona,
    getProyectoPorId,
    crearProyectos,
    crearVinculaciones,
    updateProyectoController,
    addInvestigador,
    delInvestigador,
} from '../controllers/proyectosController.js';

const router = Router();

router.get('/', getProyectos);
router.get('/grupo/:idGrupo', getProyectosDeGrupo);
router.get('/persona/:personaId', getProyectosDePersona);
router.get('/:idProyecto', getProyectoPorId)

router.post('/', crearProyectos);
router.post('/:idProyecto/vinculaciones', crearVinculaciones);
router.post('/:idProyecto/investigador', addInvestigador);
router.put('/:idProyecto', updateProyectoController);
router.delete('/:idProyecto/investigador/:idInvestigador', delInvestigador);

export default router;
