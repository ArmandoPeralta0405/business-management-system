import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { TipoArticuloService } from '../../../../../../services/tables/tipo_articulo.service';
import { ITipoArticulo } from '../../../../../../models/tipo_articulo.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-articulo-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './tipo-articulo-list.component.html',
  styleUrl: './tipo-articulo-list.component.css'
})
export class TipoArticuloListComponent {
  tiposArticulos: ITipoArticulo[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  Math = Math;

  constructor(private tipoArticuloService: TipoArticuloService) {}

  ngOnInit(): void {
    this.loadTiposArticulos();
  }

  loadTiposArticulos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.tipoArticuloService.getAll().subscribe({
      next: (data: any) => {
        this.tiposArticulos = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar los tipos de artículos. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredTiposArticulos(): ITipoArticulo[] {
    if (!this.searchText) {
      return this.tiposArticulos;
    }
    return this.tiposArticulos.filter(tipoArticulo => 
      tipoArticulo.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (tipoArticulo.id_tipo && tipoArticulo.id_tipo.toString().includes(this.searchText))
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadTiposArticulos();
  }

  eliminarTipoArticulo(id: number): void {
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
        
        this.tipoArticuloService.delete(id).subscribe({
          next: () => {
            this.tiposArticulos = this.tiposArticulos.filter(tipoArticulo => tipoArticulo.id_tipo !== id);
            Swal.fire(
              '¡Eliminado!',
              'El tipo de artículo ha sido eliminado correctamente.',
              'success'
            );
            this.isDeleting[id] = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el tipo de artículo',
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
