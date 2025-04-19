import { Router } from 'express';
import { CategoriaController } from '../controllers/Categoria.controller';

const router = Router();
const controller = new CategoriaController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;