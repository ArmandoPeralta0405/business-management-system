import { Router } from 'express';
import { TipoArticuloController } from '../controllers/TipoArticulo.controller';

const router = Router();
const controller = new TipoArticuloController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;