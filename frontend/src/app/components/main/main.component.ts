import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { ContentComponent } from "../shared/content/content.component";
import { FooterComponent } from "../shared/footer/footer.component";

@Component({
  selector: 'app-main',
  imports: [NavbarComponent, SidebarComponent, ContentComponent, FooterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  @ViewChild('sidebarOverlay') sidebarOverlay!: ElementRef<HTMLDivElement>;

  hideSidebar() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (sidebar) {
      sidebar.classList.remove('show');
    }
    if (this.sidebarOverlay?.nativeElement) {
      this.sidebarOverlay.nativeElement.style.display = 'none';
    }
  }
}
