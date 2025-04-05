import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { CiudadService } from '../../../../../../services/tables/ciudad.service';
import { ICiudad, ICiudadView } from '../../../../../../models/ciudad.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-ciudad-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './ciudad-list.component.html',
  styleUrl: './ciudad-list.component.css'
})
export class CiudadListComponent {

  ciudades: ICiudadView[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  // Mantenemos esta propiedad para la paginación
  Math = Math;

  constructor(private ciudadService: CiudadService) { }

  ngOnInit(): void {
    this.loadCiudades();
  }

  loadCiudades(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.ciudadService.getAll().subscribe({
      next: (data: any) => {
        //console.log(data);
        this.ciudades = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar las ciudades. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredCiudades(): ICiudadView[] {
    if (!this.searchText) {
      return this.ciudades;
    }
    return this.ciudades.filter(ciudad =>
      (ciudad.id_departamento && ciudad.id_departamento.toString().includes(this.searchText)) ||
      ciudad.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (ciudad.id_ciudad && ciudad.id_ciudad.toString().includes(this.searchText))
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadCiudades();
  }

  eliminarCiudad(id: number): void {
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

        this.ciudadService.delete(id).subscribe({
          next: () => {
            this.ciudades = this.ciudades.filter(ciudad => ciudad.id_ciudad !== id);
            Swal.fire(
              '¡Eliminado!',
              'La ciudad ha sido eliminada correctamente.',
              'success'
            );
            this.isDeleting[id] = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar la ciudad',
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
