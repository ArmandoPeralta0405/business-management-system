import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AjusteStockService } from '../../../../../services/tables/ajuste_stock.service';
import { IAjusteStockView } from '../../../../../models/ajuste_stock.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-ajuste-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './informe-ajuste-stock.component.html',
  styleUrl: './informe-ajuste-stock.component.css'
})
export class InformeAjusteStockComponent implements OnInit {
  ajustesStock: IAjusteStockView[] = [];
  cargando: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  // Filtros
  fechaInicial: string = '';
  fechaFinal: string = '';
  tipoMovimiento: string = 'ambos'; // 'entrada', 'salida', 'ambos'

  constructor(private ajusteStockService: AjusteStockService) {}

  ngOnInit(): void {
    this.cargarAjustesStock();
    // Inicializar fechas con el mes actual
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    
    this.fechaInicial = this.formatearFecha(primerDiaMes);
    this.fechaFinal = this.formatearFecha(ultimoDiaMes);
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cargarAjustesStock(): void {
    this.cargando = true;
    this.ajusteStockService.getAll().subscribe({
      next: (data) => {
        this.ajustesStock = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar ajustes de stock', error);
        this.mensajeError = 'Error al cargar los ajustes de stock';
        this.cargando = false;
        setTimeout(() => this.mensajeError = '', 3000);
      }
    });
  }

  validarFiltros(): boolean {
    if (!this.fechaInicial || !this.fechaFinal) {
      Swal.fire({
        title: 'Error',
        text: 'Las fechas inicial y final son obligatorias',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    const fechaIni = new Date(this.fechaInicial);
    const fechaFin = new Date(this.fechaFinal);

    if (fechaIni > fechaFin) {
      Swal.fire({
        title: 'Error',
        text: 'La fecha inicial no puede ser mayor que la fecha final',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    return true;
  }

  confirmarGenerarInforme(): void {
    if (!this.validarFiltros()) return;

    Swal.fire({
      title: '¿Generar informe?',
      text: '¿Está seguro que desea generar el informe de ajustes de stock?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.generarInforme();
      }
    });
  }

  generarInforme(): void {
    this.cargando = true;
    this.mensajeExito = '';
    this.mensajeError = '';
    
    // Preparar los parámetros para el filtro
    const params: any = {
      fechaInicial: this.fechaInicial,
      fechaFinal: this.fechaFinal
    };
    
    // Agregar el filtro de tipo de movimiento si no es "ambos"
    if (this.tipoMovimiento !== 'ambos') {
      params.id_movimiento = this.tipoMovimiento === 'entrada' ? 1 : 2;
    }
    
    this.ajusteStockService.generarInformePDFFiltrado(params).subscribe({
      next: (blob) => {
        this.cargando = false;
        
        // Crear URL del blob
        const url = window.URL.createObjectURL(blob);
        
        // Abrir el PDF en una nueva pestaña
        window.open(url, '_blank');
        
        // Mostrar mensaje de éxito con SweetAlert
        Swal.fire({
          title: '¡Éxito!',
          text: 'Informe generado correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al generar el informe', error);
        
        // Mostrar mensaje de error con SweetAlert
        Swal.fire({
          title: 'Error',
          text: 'Error al generar el informe',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  guardarInformeEnServidor(): void {
    if (!this.validarFiltros()) return;

    Swal.fire({
      title: '¿Guardar informe?',
      text: '¿Está seguro que desea guardar el informe en el servidor?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargando = true;
        this.mensajeExito = '';
        this.mensajeError = '';
        
        // Preparar los parámetros para el filtro
        const params: any = {
          fechaInicial: this.fechaInicial,
          fechaFinal: this.fechaFinal
        };
        
        // Agregar el filtro de tipo de movimiento si no es "ambos"
        if (this.tipoMovimiento !== 'ambos') {
          params.id_movimiento = this.tipoMovimiento === 'entrada' ? 1 : 2;
        }
        
        this.ajusteStockService.guardarInformePDFFiltrado(params).subscribe({
          next: (response) => {
            this.cargando = false;
            
            // Mostrar mensaje de éxito con SweetAlert
            Swal.fire({
              title: '¡Éxito!',
              text: `Informe guardado en: ${response.filePath}`,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (error) => {
            this.cargando = false;
            console.error('Error al guardar el informe', error);
            
            // Mostrar mensaje de error con SweetAlert
            Swal.fire({
              title: 'Error',
              text: 'Error al guardar el informe',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }
}
