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

            // ... otras rutas
          ]
        }
      ]
    }
  ];
