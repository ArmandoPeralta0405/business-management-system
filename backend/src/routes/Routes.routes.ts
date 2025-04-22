import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware'; // Importa el middleware
import { generateBackup } from '../controllers/backup.controller';
import rolRoutes from '../routes/Rol.routes';
import usuarioRoutes from '../routes/Usuario.routes';
import depositoRoutes from '../routes/Deposito.routes';
import paisRoutes from '../routes/Pais.routes';
import departamentoRoutes from '../routes/Departamento.routes';
import ciudadRoutes from '../routes/Ciudad.routes';
import empresaRoutes from '../routes/Empresa.routes'; 
import sucursalRoutes from '../routes/Sucursal.routes'; 
import moduloRoutes from '../routes/Modulo.routes'; 
import programaRoutes from '../routes/Programa.routes'; 
import categoriaProgramaRoutes from '../routes/CategoriaPrograma.routes'; 
import impuestoRoutes from '../routes/Impuesto.routes'; 
import marcaRoutes from '../routes/Marca.routes';
import categoriaRoutes from '../routes/Categoria.routes';
import LineaRoutes from '../routes/Linea.routes';
import TipoArticuloRoutes from '../routes/TipoArticulo.routes';
import UnidadMedidaRoutes from '../routes/UnidadMedida.routes';
import ArticuloRoutes from '../routes/Articulo.routes';
import TipoBarraRoutes from '../routes/TipoBarra.routes';


const router = Router();

router.post('/backup', generateBackup);

// Aplica el middleware de autenticación en las rutas de roles y usuarios
router.use('/roles', authenticate, rolRoutes); // Todas las rutas de roles empezarán con /roles
router.use('/usuarios', /*authenticate,*/ usuarioRoutes); // Todas las rutas de los usuarios empezarán con /usuarios
router.use('/depositos', authenticate, depositoRoutes); // Todas las rutas de los depositos empezarán con /depositos
router.use('/paises', authenticate, paisRoutes); // Todas las rutas de los paises empezarán con /paises
router.use('/departamentos', authenticate, departamentoRoutes); // Todas las rutas de los departamentos empezarán con /departamentos
router.use('/ciudades', authenticate, ciudadRoutes); // Todas las rutas de las ciudades empezarán con /ciudades
router.use('/empresas', authenticate, empresaRoutes); // Todas las rutas de las empresas empezarán con /empresas
router.use('/sucursales', authenticate, sucursalRoutes); // Todas las rutas de las sucursales empezarán con /sucursales
router.use('/modulos', authenticate, moduloRoutes); // Todas las rutas de los modulos empezarán con /modulos
router.use('/programas', authenticate, programaRoutes); // Todas las rutas de los programas empezarán con /programas
router.use('/categorias_programas', authenticate, categoriaProgramaRoutes); // Todas las rutas de las categorias de programas empezarán con /categorias_programas
router.use('/impuestos', authenticate, impuestoRoutes); // Todas las rutas de los impuestos empezarán con /impuestos
router.use('/marcas', authenticate, marcaRoutes); // Todas las rutas de las marcas empezarán con /marcas
router.use('/categorias', authenticate, categoriaRoutes); // Todas las rutas de las categorias empezarán con /categorias
router.use('/lineas', authenticate, LineaRoutes); // Todas las rutas de las lineas empezarán con /lineas
router.use('/tipos_articulos', authenticate, TipoArticuloRoutes); // Todas las rutas de los tipos de articulos empezarán con /tipos_articulos
router.use('/unidades_medidas', authenticate, UnidadMedidaRoutes); // Todas las rutas de las unidades de medidas empezarán con /unidades_medidas
router.use('/articulos', authenticate, ArticuloRoutes); // Todas las rutas de los articulos empezarán con /articulos
router.use('/tipos_barras', authenticate, TipoBarraRoutes); // Todas las rutas de los tipos de barras empezarán con /tipos_barras
// Exporta el router configurado
export default router;
