import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { TipoBarraService } from '../../../../../../services/tables/tipo_barra.service';
import { ITipoBarra } from '../../../../../../models/tipo_barra.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-barra-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './tipo-barra-list.component.html',
  styleUrl: './tipo-barra-list.component.css'
})
export class TipoBarraListComponent {
  tiposBarras: ITipoBarra[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  Math = Math;

  constructor(private tipoBarraService: TipoBarraService) {}

  ngOnInit(): void {
    this.loadTiposBarras();
  }

  loadTiposBarras(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.tipoBarraService.getAll().subscribe({
      next: (data: any) => {
        this.tiposBarras = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar los tipos de barras. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredTiposBarras(): ITipoBarra[] {
    if (!this.searchText) {
      return this.tiposBarras;
    }
    return this.tiposBarras.filter(tipoBarra => 
      tipoBarra.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (tipoBarra.id_tipo && tipoBarra.id_tipo.toString().includes(this.searchText))
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadTiposBarras();
  }

  eliminarTipoBarra(id: number): void {
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
        
        this.tipoBarraService.delete(id).subscribe({
          next: () => {
            this.tiposBarras = this.tiposBarras.filter(tipoBarra => tipoBarra.id_tipo !== id);
            Swal.fire(
              '¡Eliminado!',
              'El tipo de barra ha sido eliminado correctamente.',
              'success'
            );
            this.isDeleting[id] = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el tipo de barra',
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
