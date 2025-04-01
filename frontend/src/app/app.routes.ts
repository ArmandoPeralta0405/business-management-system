import { Routes } from '@angular/router';
import { PaisListComponent } from './components/pages/sistema_general/mantenimientos/pais/pais-list/pais-list.component';
import { PaisFormComponent } from './components/pages/sistema_general/mantenimientos/pais/pais-form/pais-form.component';
import { DashboardComponent } from './components/pages/others/dashboard/dashboard.component';

export const routes: Routes = [
    { 
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
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
            { path: 'paises/editar/:id', component: PaisFormComponent }
        ]
    }
];
