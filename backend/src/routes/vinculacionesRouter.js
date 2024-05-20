import { Router } from 'express';
import { getAllVinculaciones,
    getVinculacionesByProyectoId
} from '../controllers/vinculacionesController.js';

const router = Router()

router.get('/', getAllVinculaciones)
router.get('/:idProyecto', getVinculacionesByProyectoId);

export default router