import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SucursalService } from '../../../../../../services/tables/sucursal.service';
import { ISucursal, ISucursalView } from '../../../../../../models/sucursal.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sucursal-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './sucursal-list.component.html',
  styleUrl: './sucursal-list.component.css'
})
export class SucursalListComponent {

  sucursales: ISucursalView[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  private deletingKeys = new Set<string>(); // Mejor manejo de estados de eliminación

  // Para usar Math en la plantilla
  Math = Math;

  constructor(private sucursalService: SucursalService) { }

  ngOnInit(): void {
    this.loadSucursales();
  }

  loadSucursales(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.sucursalService.getAll().subscribe({
      next: (data) => {
        this.sucursales = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las sucursales. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredSucursales(): ISucursalView[] {
    if (!this.searchText.trim()) {
      return this.sucursales;
    }
    
    const searchTextLower = this.searchText.toLowerCase();
    
    return this.sucursales.filter(sucursal => 
      sucursal.descripcion.toLowerCase().includes(searchTextLower) ||
      (sucursal.empresa_razon_social?.toLowerCase().includes(searchTextLower)) ||
      (sucursal.empresa_ruc?.toString().includes(this.searchText)) ||
      (sucursal.telefono?.includes(this.searchText)) ||
      (sucursal.id_sucursal?.toString().includes(this.searchText))
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadSucursales();
  }

  eliminarSucursal(id_empresa: number, id_sucursal: number): void {
    const key = `${id_empresa}_${id_sucursal}`;
    
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
        this.deletingKeys.add(key);

        this.sucursalService.delete(id_empresa, id_sucursal).subscribe({
          next: () => {
            this.sucursales = this.sucursales.filter(s => 
              !(s.id_empresa === id_empresa && s.id_sucursal === id_sucursal)
            );
            Swal.fire('¡Eliminado!', 'La Sucursal ha sido eliminada correctamente.', 'success');
            this.deletingKeys.delete(key);
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'Ocurrió un error al eliminar la sucursal', 'error');
            this.deletingKeys.delete(key);
          }
        });
      }
    });
  }

  isBeingDeleted(id_empresa: number, id_sucursal: number): boolean {
    return this.deletingKeys.has(`${id_empresa}_${id_sucursal}`);
  }
}