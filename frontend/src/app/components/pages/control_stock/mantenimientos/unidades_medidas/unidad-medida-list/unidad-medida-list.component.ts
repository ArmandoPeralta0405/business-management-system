import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { UnidadMedidaService } from '../../../../../../services/tables/unidad_medida.service';
import { IUnidadMedida } from '../../../../../../models/unidad_medida.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unidad-medida-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './unidad-medida-list.component.html',
  styleUrl: './unidad-medida-list.component.css'
})
export class UnidadMedidaListComponent {
  unidadesMedidas: IUnidadMedida[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  Math = Math;

  constructor(private unidadMedidaService: UnidadMedidaService) {}

  ngOnInit(): void {
    this.loadUnidadesMedidas();
  }

  loadUnidadesMedidas(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.unidadMedidaService.getAll().subscribe({
      next: (data: any) => {
        this.unidadesMedidas = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar las unidades de medida. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredUnidadesMedidas(): IUnidadMedida[] {
    if (!this.searchText) {
      return this.unidadesMedidas;
    }
    return this.unidadesMedidas.filter(unidadMedida => 
      unidadMedida.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (unidadMedida.id_unidad && unidadMedida.id_unidad.toString().includes(this.searchText))
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadUnidadesMedidas();
  }

  eliminarUnidadMedida(id: number): void {
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
        
        this.unidadMedidaService.delete(id).subscribe({
          next: () => {
            this.unidadesMedidas = this.unidadesMedidas.filter(unidadMedida => unidadMedida.id_unidad !== id);
            Swal.fire(
              '¡Eliminado!',
              'La unidad de medida ha sido eliminada correctamente.',
              'success'
            );
            this.isDeleting[id] = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar la unidad de medida',
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
