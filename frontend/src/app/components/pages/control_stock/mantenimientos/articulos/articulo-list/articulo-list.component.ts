import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ArticuloService } from '../../../../../../services/tables/articulo.service';
import { IArticuloView } from '../../../../../../models/articulo.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-articulo-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './articulo-list.component.html',
  styleUrl: './articulo-list.component.css'
})
export class ArticuloListComponent {

  articulos: IArticuloView[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  Math = Math;

  constructor(private articuloService: ArticuloService) { }

  ngOnInit(): void {
    this.loadArticulos();
  }

  loadArticulos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.articuloService.getAll().subscribe({
      next: (data: any) => {
        this.articulos = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar los artículos. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredArticulos(): IArticuloView[] {
    if (!this.searchText) {
      return this.articulos;
    }

    const searchTextLower = this.searchText.toLowerCase();

    return this.articulos.filter(articulo => {
      return (
        articulo.descripcion.toLowerCase().includes(searchTextLower) ||
        articulo.codigo_alfanumerico.toLowerCase().includes(searchTextLower) ||
        (articulo.id_articulo && articulo.id_articulo.toString().includes(this.searchText)) ||
        articulo.estado.toLowerCase().includes(searchTextLower)
      );
    });
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadArticulos();
  }

  eliminarArticulo(id: number): void {
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

        this.articuloService.delete(id).subscribe({
          next: () => {
            this.articulos = this.articulos.filter(articulo => articulo.id_articulo !== id);
            Swal.fire(
              '¡Eliminado!',
              'El artículo ha sido eliminado correctamente.',
              'success'
            );
            this.isDeleting[id] = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el artículo',
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
