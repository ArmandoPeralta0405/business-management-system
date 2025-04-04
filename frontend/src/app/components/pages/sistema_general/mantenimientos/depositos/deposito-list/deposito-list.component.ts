import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { DepositoService } from '../../../../../../services/tables/deposito.service';
import { IDeposito } from '../../../../../../models/deposito.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-deposito-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './deposito-list.component.html',
  styleUrl: './deposito-list.component.css'
})
export class DepositoListComponent {

  depositos: IDeposito[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isDeleting: { [id: number]: boolean } = {}; // Para controlar estados de eliminación

  // Mantenemos esta propiedad para la paginación
  Math = Math;

  constructor(private depositoService: DepositoService) { }

  ngOnInit(): void {
      this.loadDepositos();
    }
  
    loadDepositos(): void {
      this.isLoading = true;
      this.errorMessage = '';
      this.depositoService.getAll().subscribe({
        next: (data: any) => {
          this.depositos = data;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.errorMessage = 'Error al cargar los depositos. Por favor, intente nuevamente.';
          this.isLoading = false;
          console.error('Error:', error);
        }
      });
    }
  
    get filteredDepositos(): IDeposito[] {
      if (!this.searchText) {
        return this.depositos;
      }
      return this.depositos.filter(deposito => 
        deposito.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (deposito.id_deposito && deposito.id_deposito.toString().includes(this.searchText))
      );
    }
  
    recargarDatos(): void {
      this.searchText = '';
      this.p = 1;
      this.loadDepositos();
    }
  
    eliminarDeposito(id: number): void {
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
          
          this.depositoService.delete(id).subscribe({
            next: () => {
              this.depositos = this.depositos.filter(deposito => deposito.id_deposito !== id);
              Swal.fire(
                '¡Eliminado!',
                'El deposito ha sido eliminado correctamente.',
                'success'
              );
              this.isDeleting[id] = false;
            },
            error: (error: any) => {
              console.error('Error al eliminar:', error);
              Swal.fire(
                'Error',
                'Ocurrió un error al eliminar el deposito',
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
