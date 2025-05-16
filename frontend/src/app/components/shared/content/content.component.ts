import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content',
  imports: [RouterOutlet],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition('* <=> *', [
        // Estilo inicial para componentes que entran
        query(':enter', [
          style({ opacity: 0 })
        ], { optional: true }),
        
        // Animación para componentes que entran
        query(':enter', [
          animate('600ms ease-in', style({ opacity: 1 }))
        ], { optional: true })
      ])
    ])
  ]
})
export class ContentComponent {
  // Método para preparar la animación de ruta
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData;
  }
}
