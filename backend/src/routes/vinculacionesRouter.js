import { Router } from 'express';
import { getAllVinculaciones,
    getVinculacionesByProyectoId,
    getVinculacionById
} from '../controllers/vinculacionesController.js';

const router = Router()

router.get('/', getAllVinculaciones)
router.get('/:idVinculacion', getVinculacionById);
router.get('/proyecto/:idProyecto', getVinculacionesByProyectoId);

export default router