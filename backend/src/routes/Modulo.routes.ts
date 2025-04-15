import { Router } from 'express';
import { ModuloController } from '../controllers/Modulo.controller';

const router = Router();
const controller = new ModuloController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;