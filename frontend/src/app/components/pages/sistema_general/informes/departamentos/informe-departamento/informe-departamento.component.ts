import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartamentoService } from '../../../../../../services/tables/departamento.service';
import { IDepartamentoView } from '../../../../../../models/departamento.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-departamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informe-departamento.component.html',
  styleUrl: './informe-departamento.component.css'
})
export class InformeDepartamentoComponent implements OnInit {
  departamentos: IDepartamentoView[] = [];
  cargando: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(private departamentoService: DepartamentoService) {}

  ngOnInit(): void {
    this.cargarDepartamentos();
  }

  cargarDepartamentos(): void {
    this.cargando = true;
    this.departamentoService.getAll().subscribe({
      next: (data) => {
        this.departamentos = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar departamentos', error);
        this.mensajeError = 'Error al cargar los departamentos';
        this.cargando = false;
        setTimeout(() => this.mensajeError = '', 3000);
      }
    });
  }

  confirmarGenerarInforme(): void {
    Swal.fire({
      title: '¿Generar informe?',
      text: '¿Está seguro que desea generar el informe de departamentos?',
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
    
    this.departamentoService.generarInformePDF().subscribe({
      next: (blob) => {
        this.cargando = false;
        
        // Crear URL del blob
        const url = window.URL.createObjectURL(blob);
        
        // Abrir el PDF en una nueva pestaña en lugar de descargarlo
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
        
        this.departamentoService.guardarInformePDF().subscribe({
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
