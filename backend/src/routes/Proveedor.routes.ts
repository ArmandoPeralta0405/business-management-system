import { Router } from 'express';
import { ProveedorController } from '../controllers/Proveedor.controller';

const router = Router();
const controller = new ProveedorController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;