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

        this.programasAgrupados = Object.entries(agrupados).map(([modulo, data]) => ({
          modulo,
          icono: data.icono,
          categorias: Object.entries(data.categorias).map(([categoria, programas]) => ({
            categoria,
            programas
          }))
        }));

        //console.log('Programas agrupados con iconos:', this.programasAgrupados);
      });
    });
  }

  generateId(value: string): string {
    return value.replace(/\s+/g, '').toLowerCase();
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

  filterPrograms(): void {
    if (this.searchText.trim() === '') {
      this.filteredPrograms = [];
      return;
    }

    this.filteredPrograms = this.programasAgrupados
      .flatMap(modulo => modulo.categorias)
      .flatMap(categoria => categoria.programas)
      .filter(programa => programa.nombre.toLowerCase().includes(this.searchText.toLowerCase()));
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