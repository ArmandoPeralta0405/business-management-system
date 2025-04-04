import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaisService } from '../../../../../../services/tables/pais.service';
import { IPais } from '../../../../../../models/pais.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pais-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './pais-list.component.html',
  styleUrl: './pais-list.component.css'
})
export class PaisListComponent {
  
  paises: IPais[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  // Mantenemos esta propiedad para la paginación
  Math = Math;

  constructor(private paisService: PaisService) { }

  ngOnInit(): void {
      this.loadPaises();
    }
  
    loadPaises(): void {
      this.isLoading = true;
      this.errorMessage = '';
      this.paisService.getAll().subscribe({
        next: (data: any) => {
          this.paises = data;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = 'Error al cargar los paises. Por favor, intente nuevamente.';
          this.isLoading = false;
          console.error('Error:', error);
        }
      });
    }
  
    get filteredPaises(): IPais[] {
      if (!this.searchText) {
        return this.paises;
      }
      return this.paises.filter(pais => 
        pais.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
        pais.nacionalidad.toLowerCase().includes(this.searchText.toLowerCase()) ||
        pais.codigo_iso3.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (pais.id_pais && pais.id_pais.toString().includes(this.searchText))
      );
    }
  
    recargarDatos(): void {
      this.searchText = '';
      this.p = 1;
      this.loadPaises();
    }
  
    eliminarPais(id: number): void {
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
          
          this.paisService.delete(id).subscribe({
            next: () => {
              this.paises = this.paises.filter(pais => pais.id_pais !== id);
              Swal.fire(
                '¡Eliminado!',
                'El pais ha sido eliminado correctamente.',
                'success'
              );
              this.isDeleting[id] = false;
            },
            error: (error: any) => {
              console.error('Error al eliminar:', error);
              Swal.fire(
                'Error',
                'Ocurrió un error al eliminar el pais',
                'error'
              );
              this.isDeleting[id] = false;
            }
          });
        }
      });
    }
  
    // Método para verificar si un rol está siendo eliminado
    isBeingDeleted(id: number): boolean {
      return this.isDeleting[id] || false;
    }
  }
