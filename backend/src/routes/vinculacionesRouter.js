import { Router } from 'express';
import { getAllVinculaciones,
    getVinculacionesByProyectoId,
    getVinculacionById,
    createDesembolso,
    getDesembolsoById,
    updateDesembolso,
    updateVinculacion,
} from '../controllers/vinculacionesController.js';

const router = Router()

router.get('/', getAllVinculaciones)
router.get('/:idVinculacion', getVinculacionById);
router.put('/:idVinculacion', updateVinculacion);
router.get('/proyecto/:idProyecto', getVinculacionesByProyectoId);
router.post('/desembolsos', createDesembolso);
router.get('/desembolsos/:idDesembolso', getDesembolsoById);
router.put('/desembolsos/:idDesembolso', updateDesembolso);

export default router