import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    const overlay = document.querySelector('.sidebar-overlay') as HTMLElement;
    
    if (sidebar && overlay) {
      const isShowing = sidebar.classList.contains('show');
      sidebar.classList.toggle('show', !isShowing);
      overlay.style.display = isShowing ? 'none' : 'block';
    }
  }
}
