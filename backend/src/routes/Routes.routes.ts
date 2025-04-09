import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware'; // Importa el middleware
import rolRoutes from '../routes/Rol.routes';
import usuarioRoutes from '../routes/Usuario.routes';
import depositoRoutes from '../routes/Deposito.routes';
import paisRoutes from '../routes/Pais.routes';
import departamentoRoutes from '../routes/Departamento.routes';
import ciudadRoutes from '../routes/Ciudad.routes';
import empresaRoutes from '../routes/Empresa.routes'; 
import sucursalRoutes from '../routes/Sucursal.routes'; 


const router = Router();

// Aplica el middleware de autenticación en las rutas de roles y usuarios
router.use('/roles', authenticate, rolRoutes); // Todas las rutas de roles empezarán con /roles
router.use('/usuarios', /*authenticate,*/ usuarioRoutes); // Todas las rutas de los usuarios empezarán con /usuarios
router.use('/depositos', authenticate, depositoRoutes); // Todas las rutas de los depositos empezarán con /depositos
router.use('/paises', authenticate, paisRoutes); // Todas las rutas de los paises empezarán con /paises
router.use('/departamentos', authenticate, departamentoRoutes); // Todas las rutas de los departamentos empezarán con /departamentos
router.use('/ciudades', authenticate, ciudadRoutes); // Todas las rutas de las ciudades empezarán con /ciudades
router.use('/empresas', authenticate, empresaRoutes); // Todas las rutas de las empresas empezarán con /empresas
router.use('/sucursales', authenticate, sucursalRoutes); // Todas las rutas de las sucursales empezarán con /sucursales

// Exporta el router configurado
export default router;
