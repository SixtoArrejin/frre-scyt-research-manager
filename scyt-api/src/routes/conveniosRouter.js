import { Router } from 'express';
import { deleteConvenio, createConvenio } from '../controllers/conveniosController.js';

const router = Router()

router.delete('/:idConvenio', deleteConvenio);
router.post('/', createConvenio);

export default router