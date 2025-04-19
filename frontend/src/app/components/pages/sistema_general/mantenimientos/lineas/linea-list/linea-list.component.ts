import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { LineaService } from '../../../../../../services/tables/linea.service';
import { ILinea, ILineaView } from '../../../../../../models/linea.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-linea-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './linea-list.component.html',
  styleUrl: './linea-list.component.css'
})
export class LineaListComponent {

  lineas: ILineaView[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  Math = Math;

  constructor(private lineaService: LineaService) { }

  ngOnInit(): void {
    this.loadLineas();
  }

  loadLineas(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.lineaService.getAll().subscribe({
      next: (data: any) => {
        this.lineas = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar las líneas. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredLineas(): ILineaView[] {
    if (!this.searchText) {
      return this.lineas;
    }
    return this.lineas.filter(linea =>
      (linea.id_categoria && linea.id_categoria.toString().includes(this.searchText)) ||
      linea.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (linea.id_linea && linea.id_linea.toString().includes(this.searchText))
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadLineas();
  }

  eliminarLinea(id: number): void {
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

        this.lineaService.delete(id).subscribe({
          next: () => {
            this.lineas = this.lineas.filter(linea => linea.id_linea !== id);
            Swal.fire(
              '¡Eliminado!',
              'La línea ha sido eliminada correctamente.',
              'success'
            );
            this.isDeleting[id] = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar la línea',
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
