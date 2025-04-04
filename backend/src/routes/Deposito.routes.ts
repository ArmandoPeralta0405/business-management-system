import { Router } from 'express';
import { DepositoController } from '../controllers/Deposito.controller';

const router = Router();
const controller = new DepositoController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;