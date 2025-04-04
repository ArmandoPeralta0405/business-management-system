import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { DepartamentoService } from '../../../../../../services/tables/departamento.service';
import { IDepartamento, IDepartamentoView } from '../../../../../../models/departamento.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamento-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './departamento-list.component.html',
  styleUrl: './departamento-list.component.css'
})
export class DepartamentoListComponent {

  departamentos: IDepartamentoView[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  // Mantenemos esta propiedad para la paginación
  Math = Math;

  constructor(private departamentoService: DepartamentoService) { }

  ngOnInit(): void {
    this.loadDepartamentos();
  }

  loadDepartamentos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.departamentoService.getAll().subscribe({
      next: (data: any) => {
        //console.log(data);
        this.departamentos = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar los departamentos. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredDepartamentos(): IDepartamentoView[] {
    if (!this.searchText) {
      return this.departamentos;
    }
    return this.departamentos.filter(departamento =>
      (departamento.id_pais && departamento.id_pais.toString().includes(this.searchText)) ||
      departamento.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
      departamento.pais_descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (departamento.id_departamento && departamento.id_departamento.toString().includes(this.searchText))
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadDepartamentos();
  }

  eliminarDepartamento(id: number): void {
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

        this.departamentoService.delete(id).subscribe({
          next: () => {
            this.departamentos = this.departamentos.filter(departamento => departamento.id_departamento !== id);
            Swal.fire(
              '¡Eliminado!',
              'El departamento ha sido eliminado correctamente.',
              'success'
            );
            this.isDeleting[id] = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el departamento',
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
