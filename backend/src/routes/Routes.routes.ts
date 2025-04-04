import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware'; // Importa el middleware
import rolRoutes from '../routes/Rol.routes';
import usuarioRoutes from '../routes/Usuario.routes';
import depositoRoutes from '../routes/Deposito.routes';


const router = Router();

// Aplica el middleware de autenticación en las rutas de roles y usuarios
router.use('/roles', authenticate, rolRoutes); // Todas las rutas de roles empezarán con /roles
router.use('/usuarios', authenticate, usuarioRoutes); // Todas las rutas de los usuarios empezarán con /usuarios
router.use('/depositos', authenticate, depositoRoutes); // Todas las rutas de los depositos empezarán con /depositos

// Exporta el router configurado
export default router;
