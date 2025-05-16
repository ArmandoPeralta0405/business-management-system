import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { ContentComponent } from "../shared/content/content.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { trigger, transition, style, animate, query, group } from '@angular/animations';

@Component({
  selector: 'app-main',
  imports: [NavbarComponent, SidebarComponent, ContentComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('600ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)' }))
      ])
    ]),
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('300ms ease-in', style({ opacity: 1 }))
          ], { optional: true })
        ])
      ])
    ])
  ]
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

  showSidebar() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (sidebar) {
      sidebar.classList.add('show');
    }
    if (this.sidebarOverlay?.nativeElement) {
      this.sidebarOverlay.nativeElement.style.display = 'block';
    }
  }

  prepareRoute(outlet: any) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
