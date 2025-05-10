import { Router } from 'express';
import { MonedaController } from '../controllers/Moneda.controller';

const router = Router();
const controller = new MonedaController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;