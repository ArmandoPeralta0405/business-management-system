import { NgIf } from '@angular/common';
import { Component} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
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
}
