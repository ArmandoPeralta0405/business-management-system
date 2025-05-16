import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../../services/dashboard.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [NgIf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Contadores para el dashboard
  usuariosCount: number = 0;
  articulosCount: number = 0;
  ventasCount: number = 0;
  ordenesCount: number = 0;
  
  // Indicadores de carga
  loadingUsuarios: boolean = true;
  loadingArticulos: boolean = true;
  loadingVentas: boolean = true;
  loadingOrdenes: boolean = true;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard(): void {
    // Cargar cantidad de usuarios
    this.dashboardService.getUsuariosCount().subscribe({
      next: (count) => {
        this.usuariosCount = count;
        this.loadingUsuarios = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loadingUsuarios = false;
      }
    });

    // Cargar cantidad de artículos
    this.dashboardService.getArticulosCount().subscribe({
      next: (count) => {
        this.articulosCount = count;
        this.loadingArticulos = false;
      },
      error: (error) => {
        console.error('Error al cargar artículos:', error);
        this.loadingArticulos = false;
      }
    });

    // Para ventas y órdenes, puedes implementar métodos similares
    // o usar valores de ejemplo por ahora
    this.loadingVentas = false;
    this.loadingOrdenes = false;
    this.ventasCount = 0; // Valor temporal
    this.ordenesCount = 0; // Valor temporal
  }
}
