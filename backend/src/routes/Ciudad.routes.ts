import { Router } from 'express';
import { CiudadController } from '../controllers/Ciudad.controller';

const router = Router();
const controller = new CiudadController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;