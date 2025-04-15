import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModuloService } from '../../../../../../services/tables/modulo.service';
import { IModulo, IModuloView } from '../../../../../../models/modulo.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modulo-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './modulo-list.component.html',
  styleUrl: './modulo-list.component.css'
})
export class ModuloListComponent {

    modulos: IModuloView[] = [];
    p: number = 1;
    itemsPerPage: number = 5;
    searchText: string = '';
    isLoading: boolean = true;
    errorMessage: string = '';
    isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación
  
    // Mantenemos esta propiedad para la paginación
    Math = Math;
  
    constructor(private moduloService: ModuloService) { }
  
    ngOnInit(): void {
      this.loadModulos();
    }
  
    loadModulos(): void {
      this.isLoading = true;
      this.errorMessage = '';
      this.moduloService.getAll().subscribe({
        next: (data: any) => {
          //console.log(data);
          this.modulos = data;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = 'Error al cargar los modulos. Por favor, intente nuevamente.';
          this.isLoading = false;
          console.error('Error:', error);
        }
      });
    }
  
    get filteredModulos(): IModuloView[] {
      if (!this.searchText) {
        return this.modulos;
      }
      return this.modulos.filter(modulo =>
        modulo.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (modulo.id_modulo && modulo.id_modulo.toString().includes(this.searchText))
      );
    }
  
    recargarDatos(): void {
      this.searchText = '';
      this.p = 1;
      this.loadModulos();
    }
  
    eliminarModulo(id: number): void {
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
  
          this.moduloService.delete(id).subscribe({
            next: () => {
              this.modulos = this.modulos.filter(modulo => modulo.id_modulo !== id);
              Swal.fire(
                '¡Eliminado!',
                'El modulo ha sido eliminado correctamente.',
                'success'
              );
              this.isDeleting[id] = false;
            },
            error: (error: any) => {
              console.error('Error al eliminar:', error);
              Swal.fire(
                'Error',
                'Ocurrió un error al eliminar el modulo',
                'error'
              );
              this.isDeleting[id] = false;
            }
          });
        }
      });
    }
  
    // Método para verificar si un modulo está siendo eliminado
    isBeingDeleted(id: number): boolean {
      return this.isDeleting[id] || false;
    }
  }
  