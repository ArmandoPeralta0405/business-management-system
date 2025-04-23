import { Router } from 'express';
import { CodigoBarraController } from '../controllers/CodigoBarra.controller';

const router = Router();
const controller = new CodigoBarraController();

router.get('/', controller.getAll);
router.get('/:id_codigo/:id_articulo', controller.getById);
router.post('/', controller.create);
router.put('/:id_codigo/:id_articulo', controller.update);
router.delete('/:id_codigo/:id_articulo', controller.delete);

export default router;