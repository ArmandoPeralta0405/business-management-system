import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isFullscreen = false;

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    const overlay = document.querySelector('.sidebar-overlay') as HTMLElement;
    
    if (sidebar && overlay) {
      const isShowing = sidebar.classList.contains('show');
      sidebar.classList.toggle('show', !isShowing);
      overlay.style.display = isShowing ? 'none' : 'block';
    }
  }

  toggleFullscreen(): void {
    const elem = document.documentElement;

    if (!document.fullscreenElement) {
      // Entrar en pantalla completa
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
          console.error(`Error al intentar entrar en pantalla completa: ${err.message}`);
        });
      }
      this.isFullscreen = true;
    } else {
      // Salir de pantalla completa
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullscreen = false;
    }
  }
}
