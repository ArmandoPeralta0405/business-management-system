import { Router } from 'express';
import { TipoBarraController } from '../controllers/TipoBarra.controller';

const router = Router();
const controller = new TipoBarraController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;