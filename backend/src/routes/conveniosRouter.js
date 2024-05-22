import { Router } from 'express';
import { deleteConvenio } from '../controllers/conveniosController.js';

const router = Router()

router.delete('/:idConvenio', deleteConvenio);

export default router