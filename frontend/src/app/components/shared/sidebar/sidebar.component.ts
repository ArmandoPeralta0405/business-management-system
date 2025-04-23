import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProgramaService } from '../../../services/tables/programa.service';
import { IProgramaView } from '../../../models/programa.model';
import { ModuloService } from '../../../services/tables/modulo.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, NgFor, NgIf, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  programasAgrupados: { modulo: string, icono: string, categorias: { categoria: string, programas: IProgramaView[] }[] }[] = [];
  searchText: string = '';
  filteredPrograms: IProgramaView[] = [];
  activeIndex: number = -1; // Índice activo para navegación con teclado

  constructor(private router: Router, private programaService: ProgramaService, private moduloService: ModuloService) {}

  ngOnInit(): void {
    this.programaService.getAll().subscribe((programas: IProgramaView[]) => {
      const modulosMap = new Map<number, string>();

      // Obtener todos los módulos para mapear sus iconos
      this.moduloService.getAll().subscribe(modulos => {
        modulos.forEach(modulo => {
          modulosMap.set(modulo.id_modulo!, modulo.icono);
        });

        const agrupados: Record<string, { icono: string, categorias: Record<string, IProgramaView[]> }> = programas.reduce((acc, programa) => {
          const moduloDescripcion = programa.modulo_descripcion;
          const icono = modulosMap.get(programa.id_modulo) || 'fas fa-cogs'; // Icono por defecto

          if (!acc[moduloDescripcion]) {
            acc[moduloDescripcion] = { icono, categorias: {} };
          }

          const categoriaDescripcion = programa.categoria_programa_descripcion;
          if (!acc[moduloDescripcion].categorias[categoriaDescripcion]) {
            acc[moduloDescripcion].categorias[categoriaDescripcion] = [];
          }

          acc[moduloDescripcion].categorias[categoriaDescripcion].push(programa);
          return acc;
        }, {} as Record<string, { icono: string, categorias: Record<string, IProgramaView[]> }>);

        this.programasAgrupados = Object.entries(agrupados)
          .map(([modulo, data]) => ({
            modulo,
            icono: data.icono,
            categorias: Object.entries(data.categorias)
              .map(([categoria, programas]) => ({
                categoria,
                programas: programas.sort((a, b) => a.nombre.localeCompare(b.nombre)) // Ordenar programas
              }))
              .sort((a, b) => a.categoria.localeCompare(b.categoria)) // Ordenar categorías
          }))
          .sort((a, b) => a.modulo.localeCompare(b.modulo)); // Ordenar módulos

        //console.log('Programas agrupados con iconos:', this.programasAgrupados);
      });
    });
  }

  generateId(value: string, parentValue?: string, grandParentValue?: string): string {
    const baseId = value.replace(/\s+/g, '').toLowerCase();
    if (grandParentValue) {
      return `${grandParentValue}-${parentValue}-${baseId}`;
    } else if (parentValue) {
      return `${parentValue}-${baseId}`;
    } else {
      return baseId;
    }
  }

  closeOnMobile() {
    if (window.innerWidth < 992) {
      const sidebar = document.querySelector('.sidebar') as HTMLElement;
      const overlay = document.querySelector('.sidebar-overlay') as HTMLElement;
      
      if (sidebar) {
        sidebar.classList.remove('show');
      }
      if (overlay) {
        overlay.style.display = 'none';
      }
    }
  }

  toggleCollapse() {
    this.closeOnMobile();
  }

  private removeAccents(text: string): string {
    return text.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  filterPrograms(): void {
    if (this.searchText.trim() === '') {
      this.filteredPrograms = [];
      this.activeIndex = -1; // Reiniciar índice activo
      return;
    }

    const normalizedSearchText = this.removeAccents(this.searchText.toLowerCase());

    this.filteredPrograms = this.programasAgrupados
      .flatMap(modulo => modulo.categorias)
      .flatMap(categoria => categoria.programas)
      .filter(programa => this.removeAccents(programa.nombre.toLowerCase()).includes(normalizedSearchText));

    this.activeIndex = 0; // Seleccionar el primer elemento por defecto
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (this.filteredPrograms.length === 0) return;

    if (event.key === 'ArrowDown') {
      this.activeIndex = (this.activeIndex + 1) % this.filteredPrograms.length;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.activeIndex = (this.activeIndex - 1 + this.filteredPrograms.length) % this.filteredPrograms.length;
      event.preventDefault();
    } else if (event.key === 'Enter') {
      const selectedProgram = this.filteredPrograms[this.activeIndex];
      if (selectedProgram) {
        this.router.navigate([selectedProgram.ruta]);
        this.searchText = ''; // Limpiar búsqueda
        this.filteredPrograms = []; // Limpiar resultados
        this.activeIndex = -1; // Reiniciar índice activo
      }
    }
  }

  logout(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro que deseas salir del sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7D161A',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Limpiar datos de autenticación
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        
        // Mostrar mensaje de éxito
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente',
          icon: 'success',
          confirmButtonColor: '#7D161A',
          timer: 2000,
          timerProgressBar: true,
          didClose: () => {
            // Redirigir al login y cerrar sidebar
            this.router.navigate(['/login']);
            this.closeOnMobile();
          }
        });
      }
    });
  }

  reloadSidebar():void {
    this.filterPrograms();
  }
}