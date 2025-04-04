import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { RolService } from '../../../../../../services/tables/rol.service';
import { IRol } from '../../../../../../models/rol.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rol-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './rol-list.component.html',
  styleUrl: './rol-list.component.css'
})
export class RolListComponent {
  roles: IRol[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  // Mantenemos esta propiedad para la paginación
  Math = Math;

  constructor(private rolService: RolService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.rolService.getAll().subscribe({
      next: (data: any) => {
        this.roles = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar los roles. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredRoles(): IRol[] {
    if (!this.searchText) {
      return this.roles;
    }
    return this.roles.filter(rol => 
      rol.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (rol.id_rol && rol.id_rol.toString().includes(this.searchText))
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadRoles();
  }

  eliminarRol(id: number): void {
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
        
        this.rolService.delete(id).subscribe({
          next: () => {
            this.roles = this.roles.filter(rol => rol.id_rol !== id);
            Swal.fire(
              '¡Eliminado!',
              'El rol ha sido eliminado correctamente.',
              'success'
            );
            this.isDeleting[id] = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el rol',
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