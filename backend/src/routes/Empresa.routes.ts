import { Router } from 'express';
import { EmpresaController } from '../controllers/Empresa.controller';

const router = Router();
const controller = new EmpresaController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;