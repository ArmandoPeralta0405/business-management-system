import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

interface Pais {
  id: number;
  codigo: string;
  descripcion: string;
  codigoSET: string;
}

@Component({
  selector: 'app-pais-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './pais-list.component.html',
  styleUrls: ['./pais-list.component.css']
})
export class PaisListComponent {
  paises: Pais[] = [
    { id: 1, codigo: '001', descripcion: 'Afganistán', codigoSET: 'AFG' },
    { id: 2, codigo: '002', descripcion: 'Albania', codigoSET: 'ALB' },
    { id: 3, codigo: '003', descripcion: 'Alemania', codigoSET: 'DEU' },
    { id: 4, codigo: '004', descripcion: 'Andorra', codigoSET: 'AND' },
    { id: 5, codigo: '005', descripcion: 'Angola', codigoSET: 'AGO' },
    { id: 6, codigo: '006', descripcion: 'Antigua y Barbuda', codigoSET: 'ATG' },
    { id: 7, codigo: '007', descripcion: 'Arabia Saudita', codigoSET: 'SAU' },
    { id: 8, codigo: '008', descripcion: 'Argelia', codigoSET: 'DZA' },
    { id: 9, codigo: '009', descripcion: 'Argentina', codigoSET: 'ARG' },
    { id: 10, codigo: '010', descripcion: 'Armenia', codigoSET: 'ARM' },
    { id: 11, codigo: '011', descripcion: 'Australia', codigoSET: 'AUS' },
    { id: 12, codigo: '012', descripcion: 'Austria', codigoSET: 'AUT' },
    { id: 13, codigo: '013', descripcion: 'Azerbaiyán', codigoSET: 'AZE' },
    { id: 14, codigo: '014', descripcion: 'Bahamas', codigoSET: 'BHS' },
    { id: 15, codigo: '015', descripcion: 'Bangladés', codigoSET: 'BGD' },
    { id: 16, codigo: '016', descripcion: 'Barbados', codigoSET: 'BRB' },
    { id: 17, codigo: '017', descripcion: 'Baréin', codigoSET: 'BHR' },
    { id: 18, codigo: '018', descripcion: 'Bélgica', codigoSET: 'BEL' },
    { id: 19, codigo: '019', descripcion: 'Belice', codigoSET: 'BLZ' },
    { id: 20, codigo: '020', descripcion: 'Benín', codigoSET: 'BEN' },
  ];
  // Variables para la paginación
  p: number = 1; // Página actual (comienza en 1)
  itemsPerPage: number = 5; // Elementos por página
  searchText: string = ''; // Para el buscador

  // Añade esta propiedad
  Math = Math;

  // Función para filtrar países basado en el texto de búsqueda
  get filteredPaises(): Pais[] {
    if (!this.searchText) {
      return this.paises;
    }
    return this.paises.filter(pais => 
      pais.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) ||
      pais.codigo.toLowerCase().includes(this.searchText.toLowerCase()) ||
      pais.codigoSET.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Método para recargar los datos
recargarDatos(): void {
  // Resetear la búsqueda
  this.searchText = '';
  
  // Volver a la primera página
  this.p = 1;
  
  // Opcional: Resetear items por página si lo deseas
  // this.itemsPerPage = 5;
  
  // Si los datos vinieran de una API, aquí harías una nueva petición
  // this.obtenerPaises();
  
  console.log('Datos recargados'); // Para verificar que funciona
}
}