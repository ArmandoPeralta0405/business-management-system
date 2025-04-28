import { Router } from 'express';
import { DetalleAjusteStockController } from '../controllers/DetalleAjusteStock.controller';

const router = Router();
const controller = new DetalleAjusteStockController();

router.get('/', controller.getAll);
router.get('/:id_ajuste/:id_articulo/:numero_item', controller.getById);
router.post('/', controller.create);
router.put('/:id_ajuste/:id_articulo/:numero_item', controller.update);
router.delete('/:id_ajuste/:id_articulo/:numero_item', controller.delete);

export default router;