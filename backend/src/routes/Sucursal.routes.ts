import { Router } from 'express';
import { SucursalController } from '../controllers/Sucursal.controller';

const router = Router();
const controller = new SucursalController();

router.get('/', controller.getAll);
router.get('/:id_empresa', controller.getByEmpresa);
router.get('/:id_empresa/:id_sucursal', controller.getById);
router.post('/', controller.create);
router.put('/:id_empresa/:id_sucursal', controller.update);
router.delete('/:id_empresa/:id_sucursal', controller.delete);

export default router;