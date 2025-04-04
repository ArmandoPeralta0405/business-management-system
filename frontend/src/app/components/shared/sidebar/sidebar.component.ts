import { NgIf } from '@angular/common';
import { Component} from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(private router: Router) {}

  closeOnMobile() {
    if (window.innerWidth < 992) {
      const sidebar = document.querySelector('.sidebar') as HTMLElement;
      const overlay = document.querySelector('.sidebar-overlay') as HTMLElement;
      
      if (sidebar) {
        sidebar.classList.remove('show');
      }
      if (overlay) {
        overlay.style.display = 'none';
      }
    }
  }

  toggleCollapse() {
    this.closeOnMobile();
  }

  logout(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro que deseas salir del sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7D161A',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Limpiar datos de autenticación
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        
        // Mostrar mensaje de éxito
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente',
          icon: 'success',
          confirmButtonColor: '#7D161A',
          timer: 2000,
          timerProgressBar: true,
          didClose: () => {
            // Redirigir al login y cerrar sidebar
            this.router.navigate(['/login']);
            this.closeOnMobile();
          }
        });
      }
    });
  }
}
