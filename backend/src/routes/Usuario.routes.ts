import { Router } from 'express';
import { UsuarioController } from '../controllers/Usuario.controller';

const router = Router();
const controller = new UsuarioController();

// Rutas CRUD básicas
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;