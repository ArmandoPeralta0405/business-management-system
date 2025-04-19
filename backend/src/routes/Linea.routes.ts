import { Router } from 'express';
import { LineaController } from '../controllers/Linea.controller';

const router = Router();
const controller = new LineaController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;