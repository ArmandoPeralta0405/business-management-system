import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProveedorService } from '../../../../../../services/tables/proveedor.service';
import { IProveedorView } from '../../../../../../models/proveedor.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './proveedor-list.component.html',
  styleUrl: './proveedor-list.component.css'
})
export class ProveedorListComponent {

  proveedores: IProveedorView[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  private deletingKeys = new Set<number>(); // Manejo de estados de eliminación

  Math = Math; // Para usar Math en la plantilla

  constructor(private proveedorService: ProveedorService) { }

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.proveedorService.getAll().subscribe({
      next: (data) => {
        this.proveedores = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los proveedores. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredProveedores(): IProveedorView[] {
    if (!this.searchText.trim()) {
      return this.proveedores;
    }

    const searchTextLower = this.searchText.toLowerCase();

    return this.proveedores.filter(proveedor => 
      proveedor.razon_social.toLowerCase().includes(searchTextLower) ||
      (proveedor.nombre_fantasia && proveedor.nombre_fantasia.toLowerCase().includes(searchTextLower)) ||
      (proveedor.ruc && proveedor.ruc.toLowerCase().includes(searchTextLower)) ||
      (proveedor.cedula && proveedor.cedula.toLowerCase().includes(searchTextLower)) ||
      proveedor.direccion.toLowerCase().includes(searchTextLower) ||
      proveedor.email.toLowerCase().includes(searchTextLower) ||
      proveedor.telefono.toLowerCase().includes(searchTextLower)
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadProveedores();
  }

  eliminarProveedor(id_proveedor: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: "¡No podrá revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deletingKeys.add(id_proveedor);

        this.proveedorService.delete(id_proveedor).subscribe({
          next: () => {
            this.proveedores = this.proveedores.filter(p => p.id_proveedor !== id_proveedor);
            Swal.fire('¡Eliminado!', 'El proveedor ha sido eliminado correctamente.', 'success');
            this.deletingKeys.delete(id_proveedor);
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'Ocurrió un error al eliminar el proveedor', 'error');
            this.deletingKeys.delete(id_proveedor);
          }
        });
      }
    });
  }

  isBeingDeleted(id_proveedor: number): boolean {
    return this.deletingKeys.has(id_proveedor);
  }
}
