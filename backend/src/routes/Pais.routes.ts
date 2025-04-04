import { Router } from 'express';
import { PaisController } from '../controllers/Pais.controller';

const router = Router();
const controller = new PaisController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;