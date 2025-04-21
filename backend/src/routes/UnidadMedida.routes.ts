import { Router } from 'express';
import { UnidadMedidaController } from '../controllers/UnidadMedida.controller';

const router = Router();
const controller = new UnidadMedidaController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;