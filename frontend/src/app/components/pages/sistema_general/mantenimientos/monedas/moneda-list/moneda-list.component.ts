import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { MonedaService } from '../../../../../../services/tables/moneda.service';
import { IMoneda, IMonedaView } from '../../../../../../models/moneda.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-moneda-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './moneda-list.component.html',
  styleUrl: './moneda-list.component.css'
})
export class MonedaListComponent {

  monedas: IMonedaView[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  // Mantenemos esta propiedad para la paginación
  Math = Math;

  constructor(private monedaService: MonedaService) { }

  ngOnInit(): void {
    this.loadMonedas();
  }

  loadMonedas(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.monedaService.getAll().subscribe({
      next: (data: any) => {
        //console.log(data);
        this.monedas = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar las monedas. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredMonedas(): IMonedaView[] {
    if (!this.searchText) {
      return this.monedas;
    }
    return this.monedas.filter(moneda =>
      moneda.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (moneda.id_moneda && moneda.id_moneda.toString().includes(this.searchText)) ||
      (moneda.simbolo && moneda.simbolo.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadMonedas();
  }

  eliminarMoneda(id: number): void {
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

        this.monedaService.delete(id).subscribe({
          next: () => {
            this.monedas = this.monedas.filter(moneda => moneda.id_moneda !== id);
            Swal.fire(
              '¡Eliminado!',
              'La moneda ha sido eliminada correctamente.',
              'success'
            );
            this.isDeleting[id] = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar la moneda',
              'error'
            );
            this.isDeleting[id] = false;
          }
        });
      }
    });
  }

  // Método para verificar si una moneda está siendo eliminada
  isBeingDeleted(id: number): boolean {
    return this.isDeleting[id] || false;
  }
}
