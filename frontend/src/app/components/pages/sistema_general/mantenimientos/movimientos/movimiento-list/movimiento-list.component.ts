import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { MovimientoService } from '../../../../../../services/tables/movimiento.service';
import { IMovimiento, IMovimientoView } from '../../../../../../models/movimiento.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movimiento-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './movimiento-list.component.html',
  styleUrl: './movimiento-list.component.css'
})
export class MovimientoListComponent {
  movimientos: IMovimientoView[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  // Mantenemos esta propiedad para la paginación
  Math = Math;

  constructor(private movimientoService: MovimientoService) { }

  ngOnInit(): void {
    this.loadMovimientos();
  }

  loadMovimientos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.movimientoService.getAll().subscribe({
      next: (data: any) => {
        //console.log(data);
        this.movimientos = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar los movimientos. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredMovimientos(): IMovimientoView[] {
    if (!this.searchText) {
      return this.movimientos;
    }
    return this.movimientos.filter(movimiento =>
      (movimiento.descripcion.toLowerCase().includes(this.searchText.toLowerCase())||
      movimiento.abreviacion.toLowerCase().includes(this.searchText.toLowerCase()) ||
      movimiento.tipo_movimiento.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (movimiento.id_movimiento && movimiento.id_movimiento.toString().includes(this.searchText)))
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadMovimientos();
  }

  eliminarMovimiento(id: number): void {
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

        this.movimientoService.delete(id).subscribe({
          next: () => {
            this.movimientos = this.movimientos.filter(movimiento => movimiento.id_movimiento !== id);
            Swal.fire(
              '¡Eliminado!',
              'El movimiento ha sido eliminado correctamente.',
              'success'
            );
            this.isDeleting[id] = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el movimiento',
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
