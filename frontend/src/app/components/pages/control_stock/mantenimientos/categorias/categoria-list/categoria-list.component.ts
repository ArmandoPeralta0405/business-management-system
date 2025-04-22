import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { CategoriaService } from '../../../../../../services/tables/categoria.service';
import { ICategoria } from '../../../../../../models/categoria.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.css'
})
export class CategoriaListComponent {
  categorias: ICategoria[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  Math = Math;

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.categoriaService.getAll().subscribe({
      next: (data: any) => {
        this.categorias = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar las categorías. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredCategorias(): ICategoria[] {
    if (!this.searchText) {
      return this.categorias;
    }
    return this.categorias.filter(categoria => 
      categoria.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (categoria.id_categoria && categoria.id_categoria.toString().includes(this.searchText))
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadCategorias();
  }

  eliminarCategoria(id: number): void {
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
        
        this.categoriaService.delete(id).subscribe({
          next: () => {
            this.categorias = this.categorias.filter(categoria => categoria.id_categoria !== id);
            Swal.fire(
              '¡Eliminado!',
              'La categoría ha sido eliminada correctamente.',
              'success'
            );
            this.isDeleting[id] = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar la categoría',
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
