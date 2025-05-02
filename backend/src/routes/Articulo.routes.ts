import { Router } from 'express';
import { ArticuloController } from '../controllers/Articulo.controller';

const router = Router();
const controller = new ArticuloController();

router.get('/activos', controller.getArticulosActivos);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;