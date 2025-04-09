import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { EmpresaService } from '../../../../../../services/tables/empresa.service';
import { IEmpresa, IEmpresaView } from '../../../../../../models/empresa.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresa-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './empresa-list.component.html',
  styleUrl: './empresa-list.component.css'
})
export class EmpresaListComponent {

  empresas: IEmpresaView[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  // Mantenemos esta propiedad para la paginación
  Math = Math;

  constructor(private empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.loadEmpresas();
  }

  loadEmpresas(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.empresaService.getAll().subscribe({
      next: (data: any) => {
        //console.log(data);
        this.empresas = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error al cargar las empresas. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredEmpresas(): IEmpresaView[] {
    if (!this.searchText) {
      return this.empresas;
    }
    
    const searchTextLower = this.searchText.toLowerCase();
    
    return this.empresas.filter(empresa => {
      // Preparamos el RUC completo (con formato 12345678-1)
      const rucCompleto = empresa.ruc ? `${empresa.ruc}${empresa.dv ? '-' + empresa.dv : ''}` : '';
      
      return (
        empresa.razon_social.toLowerCase().includes(searchTextLower) ||
        (empresa.nombre_comercial && empresa.nombre_comercial.toLowerCase().includes(searchTextLower)) ||
        (empresa.ruc && empresa.ruc.toString().includes(this.searchText)) ||  // Busca solo el RUC
        (empresa.dv && empresa.dv.toString().includes(this.searchText)) ||    // Busca solo el DV
        rucCompleto.includes(this.searchText) ||                              // Busca el RUC completo con DV
        (empresa.telefono && empresa.telefono.includes(this.searchText)) ||
        (empresa.email && empresa.email.toLowerCase().includes(searchTextLower)) ||
        (empresa.id_ciudad && empresa.id_ciudad.toString().includes(this.searchText)) ||
        (empresa.id_empresa && empresa.id_empresa.toString().includes(this.searchText))
      );
    });
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadEmpresas();
  }

  eliminarEmpresa(id: number): void {
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

        this.empresaService.delete(id).subscribe({
          next: () => {
            this.empresas = this.empresas.filter(empresa => empresa.id_empresa !== id);
            Swal.fire(
              '¡Eliminado!',
              'La empresa ha sido eliminada correctamente.',
              'success'
            );
            this.isDeleting[id] = false;
          },
          error: (error: any) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar la empresa',
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
