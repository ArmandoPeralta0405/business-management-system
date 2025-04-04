import { Routes } from '@angular/router';
import { PaisListComponent } from './components/pages/sistema_general/mantenimientos/pais/pais-list/pais-list.component';
import { PaisFormComponent } from './components/pages/sistema_general/mantenimientos/pais/pais-form/pais-form.component';
import { DashboardComponent } from './components/pages/others/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { MainComponent } from './components/main/main.component';
import { authGuard } from './guards/auth.guard';
import { RolListComponent } from './components/pages/sistema_general/mantenimientos/roles/rol-list/rol-list.component';
import { RolFormComponent } from './components/pages/sistema_general/mantenimientos/roles/rol-form/rol-form.component';
import { DepositoFormComponent } from './components/pages/sistema_general/mantenimientos/depositos/deposito-form/deposito-form.component';
import { DepositoListComponent } from './components/pages/sistema_general/mantenimientos/depositos/deposito-list/deposito-list.component';

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
            { path: 'paises', component: PaisListComponent },
            { path: 'paises/nuevo', component: PaisFormComponent },
            { path: 'roles', component: RolListComponent },
            { path: 'roles/nuevo', component: RolFormComponent },
            { path: 'roles/editar/:id', component: RolFormComponent },
            { path: 'depositos', component: DepositoListComponent },
            { path: 'depositos/nuevo', component: DepositoFormComponent },
            { path: 'depositos/editar/:id', component: DepositoFormComponent },
            // ... otras rutas
          ]
        }
      ]
    }
  ];
