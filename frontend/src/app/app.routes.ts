import { Routes } from '@angular/router';
import { DashboardComponent } from './components/pages/others/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { MainComponent } from './components/main/main.component';
import { authGuard } from './guards/auth.guard';
import { RolListComponent } from './components/pages/sistema_general/mantenimientos/roles/rol-list/rol-list.component';
import { RolFormComponent } from './components/pages/sistema_general/mantenimientos/roles/rol-form/rol-form.component';
import { DepositoFormComponent } from './components/pages/sistema_general/mantenimientos/depositos/deposito-form/deposito-form.component';
import { DepositoListComponent } from './components/pages/sistema_general/mantenimientos/depositos/deposito-list/deposito-list.component';
import { PaisListComponent } from './components/pages/sistema_general/mantenimientos/paises/pais-list/pais-list.component';
import { PaisFormComponent } from './components/pages/sistema_general/mantenimientos/paises/pais-form/pais-form.component';
import { DepartamentoFormComponent } from './components/pages/sistema_general/mantenimientos/departamentos/departamento-form/departamento-form.component';
import { DepartamentoListComponent } from './components/pages/sistema_general/mantenimientos/departamentos/departamento-list/departamento-list.component';
import { CiudadFormComponent } from './components/pages/sistema_general/mantenimientos/ciudades/ciudad-form/ciudad-form.component';
import { CiudadListComponent } from './components/pages/sistema_general/mantenimientos/ciudades/ciudad-list/ciudad-list.component';
import { EmpresaFormComponent } from './components/pages/sistema_general/mantenimientos/empresas/empresa-form/empresa-form.component';
import { EmpresaListComponent } from './components/pages/sistema_general/mantenimientos/empresas/empresa-list/empresa-list.component';
import { SucursalFormComponent } from './components/pages/sistema_general/mantenimientos/sucursales/sucursal-form/sucursal-form.component';
import { SucursalListComponent } from './components/pages/sistema_general/mantenimientos/sucursales/sucursal-list/sucursal-list.component';
import { ModuloFormComponent } from './components/pages/sistema_general/mantenimientos/modulos/modulo-form/modulo-form.component';
import { ModuloListComponent } from './components/pages/sistema_general/mantenimientos/modulos/modulo-list/modulo-list.component';
import { ProgramaFormComponent } from './components/pages/sistema_general/mantenimientos/programas/programa-form/programa-form.component';
import { ProgramaListComponent } from './components/pages/sistema_general/mantenimientos/programas/programa-list/programa-list.component';
import { CategoriaProgramaListComponent } from './components/pages/sistema_general/mantenimientos/categorias_programas/categoria-programa-list/categoria-programa-list.component';
import { CategoriaProgramaFormComponent } from './components/pages/sistema_general/mantenimientos/categorias_programas/categoria-programa-form/categoria-programa-form.component';
import { ImpuestoFormComponent } from './components/pages/control_stock/mantenimientos/impuestos/impuesto-form/impuesto-form.component';
import { ImpuestoListComponent } from './components/pages/control_stock/mantenimientos/impuestos/impuesto-list/impuesto-list.component';
import { MarcaFormComponent } from './components/pages/control_stock/mantenimientos/marcas/marca-form/marca-form.component';
import { MarcaListComponent } from './components/pages/control_stock/mantenimientos/marcas/marca-list/marca-list.component';
import { CategoriaFormComponent } from './components/pages/control_stock/mantenimientos/categorias/categoria-form/categoria-form.component';
import { CategoriaListComponent } from './components/pages/control_stock/mantenimientos/categorias/categoria-list/categoria-list.component';
import { LineaFormComponent } from './components/pages/control_stock/mantenimientos/lineas/linea-form/linea-form.component';
import { LineaListComponent } from './components/pages/control_stock/mantenimientos/lineas/linea-list/linea-list.component';
import { TipoArticuloFormComponent } from './components/pages/control_stock/mantenimientos/tipos_articulos/tipo-articulo-form/tipo-articulo-form.component';
import { TipoArticuloListComponent } from './components/pages/control_stock/mantenimientos/tipos_articulos/tipo-articulo-list/tipo-articulo-list.component';
import { UnidadMedidaListComponent } from './components/pages/control_stock/mantenimientos/unidades_medidas/unidad-medida-list/unidad-medida-list.component';
import { UnidadMedidaFormComponent } from './components/pages/control_stock/mantenimientos/unidades_medidas/unidad-medida-form/unidad-medida-form.component';
import { ArticuloFormComponent } from './components/pages/control_stock/mantenimientos/articulos/articulo-form/articulo-form.component';
import { ArticuloListComponent } from './components/pages/control_stock/mantenimientos/articulos/articulo-list/articulo-list.component';
import { TipoBarraFormComponent } from './components/pages/control_stock/mantenimientos/tipos_barras/tipo-barra-form/tipo-barra-form.component';
import { TipoBarraListComponent } from './components/pages/control_stock/mantenimientos/tipos_barras/tipo-barra-list/tipo-barra-list.component';
import { MovimientoFormComponent } from './components/pages/sistema_general/mantenimientos/movimientos/movimiento-form/movimiento-form.component';
import { MovimientoListComponent } from './components/pages/sistema_general/mantenimientos/movimientos/movimiento-list/movimiento-list.component';
import { AjusteStockFormComponent } from './components/pages/control_stock/movimientos/ajustes_stocks/ajuste-stock-form/ajuste-stock-form.component';
import { InformeDepartamentoComponent } from './components/pages/sistema_general/informes/departamentos/informe-departamento/informe-departamento.component';
import { InformeAjusteStockComponent } from './components/pages/control_stock/informes/informe-ajuste-stock/informe-ajuste-stock.component';
import { MonedaFormComponent } from './components/pages/sistema_general/mantenimientos/monedas/moneda-form/moneda-form.component';
import { MonedaListComponent } from './components/pages/sistema_general/mantenimientos/monedas/moneda-list/moneda-list.component';

export const routes: Routes = [
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: '',
      component: MainComponent,
      canActivate: [authGuard],       // ← Protege el contenedor padre
      canActivateChild: [authGuard],  // ← Protege TODAS las rutas hijas
      children: [
        { 
          path: '', 
          redirectTo: 'dashboard', 
          pathMatch: 'full' 
        },
        { 
          path: 'dashboard', 
          component: DashboardComponent 
        },
        { 
          path: 'sistema_general/mantenimientos',
          children: [
            { path: 'roles', component: RolListComponent },
            { path: 'roles/nuevo', component: RolFormComponent },
            { path: 'roles/editar/:id', component: RolFormComponent },

            { path: 'depositos', component: DepositoListComponent },
            { path: 'depositos/nuevo', component: DepositoFormComponent },
            { path: 'depositos/editar/:id', component: DepositoFormComponent },

            { path: 'paises', component: PaisListComponent },
            { path: 'paises/nuevo', component: PaisFormComponent },
            { path: 'paises/editar/:id', component: PaisFormComponent },

            { path: 'departamentos', component: DepartamentoListComponent },
            { path: 'departamentos/nuevo', component: DepartamentoFormComponent },
            { path: 'departamentos/editar/:id', component: DepartamentoFormComponent },

            { path: 'ciudades', component: CiudadListComponent },
            { path: 'ciudades/nuevo', component: CiudadFormComponent },
            { path: 'ciudades/editar/:id', component: CiudadFormComponent },

            { path: 'empresas', component: EmpresaListComponent },
            { path: 'empresas/nuevo', component: EmpresaFormComponent },
            { path: 'empresas/editar/:id', component: EmpresaFormComponent },

            { path: 'sucursales', component: SucursalListComponent },
            { path: 'sucursales/nuevo', component: SucursalFormComponent },
            { path: 'sucursales/editar/:id_empresa/:id_sucursal', component: SucursalFormComponent },

            { path: 'modulos', component: ModuloListComponent },
            { path: 'modulos/nuevo', component: ModuloFormComponent },
            { path: 'modulos/editar/:id', component: ModuloFormComponent },

            { path: 'programas', component: ProgramaListComponent },
            { path: 'programas/nuevo', component: ProgramaFormComponent },
            { path: 'programas/editar/:id', component: ProgramaFormComponent },

            { path: 'categorias-programas', component: CategoriaProgramaListComponent },
            { path: 'categorias-programas/nuevo', component: CategoriaProgramaFormComponent },
            { path: 'categorias-programas/editar/:id', component: CategoriaProgramaFormComponent },

            { path: 'movimientos', component: MovimientoListComponent },
            { path: 'movimientos/nuevo', component: MovimientoFormComponent },
            { path: 'movimientos/editar/:id', component: MovimientoFormComponent },

            { path: 'monedas', component: MonedaListComponent },
            { path: 'monedas/nuevo', component: MonedaFormComponent },
            { path: 'monedas/editar/:id', component: MonedaFormComponent },

            // ... otras rutas
          ]
        },
        { 
          path: 'sistema_general/informes',
          children: [
            { path: 'departamentos', component: InformeDepartamentoComponent }
          ]
        },
        { 
          path: 'control_stock/mantenimientos',
          children: [
            { path: 'categorias', component: CategoriaListComponent },
            { path: 'categorias/nuevo', component: CategoriaFormComponent },
            { path: 'categorias/editar/:id', component: CategoriaFormComponent },

            { path: 'impuestos', component: ImpuestoListComponent },
            { path: 'impuestos/nuevo', component: ImpuestoFormComponent },
            { path: 'impuestos/editar/:id', component: ImpuestoFormComponent },

            { path: 'articulos', component: ArticuloListComponent },
            { path: 'articulos/nuevo', component: ArticuloFormComponent },
            { path: 'articulos/editar/:id', component: ArticuloFormComponent },

            { path: 'tipos_barras', component: TipoBarraListComponent },
            { path: 'tipos_barras/nuevo', component: TipoBarraFormComponent },
            { path: 'tipos_barras/editar/:id', component: TipoBarraFormComponent },

            { path: 'lineas', component: LineaListComponent },
            { path: 'lineas/nuevo', component: LineaFormComponent },
            { path: 'lineas/editar/:id', component: LineaFormComponent },

            { path: 'marcas', component: MarcaListComponent },
            { path: 'marcas/nuevo', component: MarcaFormComponent },
            { path: 'marcas/editar/:id', component: MarcaFormComponent },

            { path: 'tipos_articulos', component: TipoArticuloListComponent },
            { path: 'tipos_articulos/nuevo', component: TipoArticuloFormComponent },
            { path: 'tipos_articulos/editar/:id', component: TipoArticuloFormComponent },

            { path: 'unidades_medidas', component: UnidadMedidaListComponent },
            { path: 'unidades_medidas/nuevo', component: UnidadMedidaFormComponent },
            { path: 'unidades_medidas/editar/:id', component: UnidadMedidaFormComponent },

          ]
        },
        { 
          path: 'control_stock/movimientos',
          children: [
            { path: 'ajustes_stocks', component: AjusteStockFormComponent }
          ]
        },
        { 
          path: 'control_stock/informes',
          children: [
            { path: 'ajustes_stocks', component: InformeAjusteStockComponent }
          ]
        },
      ]
    }
  ];
