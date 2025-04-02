import { Router } from 'express';
import { RolController } from '../controllers/Rol.controller';

const router = Router();
const controller = new RolController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;