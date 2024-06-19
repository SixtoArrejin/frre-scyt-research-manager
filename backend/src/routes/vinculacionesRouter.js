import { Router } from 'express';
import { getAllVinculaciones,
    getVinculacionesByProyectoId,
    getVinculacionById,
    createDesembolso,
    getDesembolsoById,
    updateDesembolso,
} from '../controllers/vinculacionesController.js';

const router = Router()

router.get('/', getAllVinculaciones)
router.get('/:idVinculacion', getVinculacionById);
router.get('/proyecto/:idProyecto', getVinculacionesByProyectoId);
router.post('/desembolsos', createDesembolso);
router.get('/desembolsos/:idDesembolso', getDesembolsoById);
router.put('/desembolsos/:idDesembolso', updateDesembolso);

export default router