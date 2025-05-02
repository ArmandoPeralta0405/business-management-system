import { Router } from 'express';
import { AjusteStockController } from '../controllers/AjusteStock.controller';

const router = Router();
const controller = new AjusteStockController();

router.get('/nuevo_comprobante', controller.fetchNextNumeroComprobante);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);


export default router;