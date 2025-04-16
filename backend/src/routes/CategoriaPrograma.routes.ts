import { Router } from 'express';
import { CategoriaProgramaController } from '../controllers/CategoriaPrograma.controller';

const router = Router();
const controller = new CategoriaProgramaController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;