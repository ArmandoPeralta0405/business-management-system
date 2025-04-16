import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProgramaService } from '../../../../../../services/tables/programa.service';
import { IProgramaView } from '../../../../../../models/programa.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-programa-list',
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './programa-list.component.html',
  styleUrl: './programa-list.component.css'
})
export class ProgramaListComponent {

  programas: IProgramaView[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  searchText: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  private deletingKeys = new Set<number>(); // Manejo de estados de eliminación

  Math = Math; // Para usar Math en la plantilla

  constructor(private programaService: ProgramaService) { }

  ngOnInit(): void {
    this.loadProgramas();
  }

  loadProgramas(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.programaService.getAll().subscribe({
      next: (data) => {
        this.programas = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los programas. Por favor, intente nuevamente.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  get filteredProgramas(): IProgramaView[] {
    if (!this.searchText.trim()) {
      return this.programas;
    }

    const searchTextLower = this.searchText.toLowerCase();

    return this.programas.filter(programa => 
      programa.nombre.toLowerCase().includes(searchTextLower) ||
      programa.ruta.toLowerCase().includes(searchTextLower) ||
      programa.categoria_programa_descripcion.toLowerCase().includes(searchTextLower) ||
      programa.modulo_descripcion.toLowerCase().includes(searchTextLower)
    );
  }

  recargarDatos(): void {
    this.searchText = '';
    this.p = 1;
    this.loadProgramas();
  }

  eliminarPrograma(id_programa: number): void {
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
        this.deletingKeys.add(id_programa);

        this.programaService.delete(id_programa).subscribe({
          next: () => {
            this.programas = this.programas.filter(p => p.id_programa !== id_programa);
            Swal.fire('¡Eliminado!', 'El programa ha sido eliminado correctamente.', 'success');
            this.deletingKeys.delete(id_programa);
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'Ocurrió un error al eliminar el programa', 'error');
            this.deletingKeys.delete(id_programa);
          }
        });
      }
    });
  }

  isBeingDeleted(id_programa: number): boolean {
    return this.deletingKeys.has(id_programa);
  }
}
