import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ImpuestoService } from '../../../../../../services/tables/impuesto.service';
import { IImpuesto } from '../../../../../../models/impuesto.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-impuesto-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './impuesto-list.component.html',
  styleUrl: './impuesto-list.component.css'
})
export class ImpuestoListComponent {
  impuestos: IImpuesto[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  Math = Math;

  constructor(private impuestoService: ImpuestoService) {}

  ngOnInit(): void {
    this.loadImpuestos();
  }

  loadImpuestos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.impuestoService.getAll().subscribe({
      next: (data: any) => {
        this.impuestos = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar los impuestos. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredImpuestos(): IImpuesto[] {
    if (!this.searchText) {
      return this.impuestos;
    }
    return this.impuestos.filter(impuesto => 
      impuesto.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (impuesto.id_impuesto && impuesto.id_impuesto.toString().includes(this.searchText))
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadImpuestos();
  }

  eliminarImpuesto(id: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isDeleting[id] = true;
        
        this.impuestoService.delete(id).subscribe({
          next: () => {
            this.impuestos = this.impuestos.filter(impuesto => impuesto.id_impuesto !== id);
            Swal.fire(
              '¡Eliminado!',
              'El impuesto ha sido eliminado correctamente.',
              'success'
            );
            this.isDeleting[id] = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el impuesto',
              'error'
            );
            this.isDeleting[id] = false;
          }
        });
      }
    });
  }

  isBeingDeleted(id: number): boolean {
    return this.isDeleting[id] || false;
  }
}
