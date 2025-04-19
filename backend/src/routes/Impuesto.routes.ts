import { Router } from 'express';
import { ImpuestoController } from '../controllers/Impuesto.controller';

const router = Router();
const controller = new ImpuestoController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;