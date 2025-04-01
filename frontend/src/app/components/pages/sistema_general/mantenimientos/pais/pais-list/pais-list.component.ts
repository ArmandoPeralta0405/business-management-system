import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


interface Pais {
  id: number;
  codigo: string;
  descripcion: string;
  codigoSET: string;
}

@Component({
  selector: 'app-pais-list',
  imports: [RouterLink, FormsModule, NgFor, NgIf],
  templateUrl: './pais-list.component.html',
  styleUrl: './pais-list.component.css'
})
export class PaisListComponent {


  // Datos de ejemplo en JSON
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
    { id: 21, codigo: '021', descripcion: 'Bielorrusia', codigoSET: 'BLR' },
    { id: 22, codigo: '022', descripcion: 'Birmania', codigoSET: 'MMR' },
    { id: 23, codigo: '023', descripcion: 'Bolivia', codigoSET: 'BOL' },
    { id: 24, codigo: '024', descripcion: 'Bosnia y Herzegovina', codigoSET: 'BIH' },
    { id: 25, codigo: '025', descripcion: 'Botsuana', codigoSET: 'BWA' },
    { id: 26, codigo: '026', descripcion: 'Brasil', codigoSET: 'BRA' },
    { id: 27, codigo: '027', descripcion: 'Brunéi', codigoSET: 'BRN' },
    { id: 28, codigo: '028', descripcion: 'Bulgaria', codigoSET: 'BGR' },
    { id: 29, codigo: '029', descripcion: 'Burkina Faso', codigoSET: 'BFA' },
    { id: 30, codigo: '030', descripcion: 'Burundi', codigoSET: 'BDI' },
    { id: 31, codigo: '031', descripcion: 'Bután', codigoSET: 'BTN' },
    { id: 32, codigo: '032', descripcion: 'Cabo Verde', codigoSET: 'CPV' },
    { id: 33, codigo: '033', descripcion: 'Camboya', codigoSET: 'KHM' },
    { id: 34, codigo: '034', descripcion: 'Camerún', codigoSET: 'CMR' },
    { id: 35, codigo: '035', descripcion: 'Canadá', codigoSET: 'CAN' },
    { id: 36, codigo: '036', descripcion: 'Catar', codigoSET: 'QAT' },
    { id: 37, codigo: '037', descripcion: 'Chad', codigoSET: 'TCD' },
    { id: 38, codigo: '038', descripcion: 'Chile', codigoSET: 'CHL' },
    { id: 39, codigo: '039', descripcion: 'China', codigoSET: 'CHN' },
    { id: 40, codigo: '040', descripcion: 'Chipre', codigoSET: 'CYP' },
    { id: 41, codigo: '041', descripcion: 'Colombia', codigoSET: 'COL' },
    { id: 42, codigo: '042', descripcion: 'Comoras', codigoSET: 'COM' },
    { id: 43, codigo: '043', descripcion: 'Corea del Norte', codigoSET: 'PRK' },
    { id: 44, codigo: '044', descripcion: 'Corea del Sur', codigoSET: 'KOR' },
    { id: 45, codigo: '045', descripcion: 'Costa de Marfil', codigoSET: 'CIV' },
    { id: 46, codigo: '046', descripcion: 'Costa Rica', codigoSET: 'CRI' },
    { id: 47, codigo: '047', descripcion: 'Croacia', codigoSET: 'HRV' },
    { id: 48, codigo: '048', descripcion: 'Cuba', codigoSET: 'CUB' },
    { id: 49, codigo: '049', descripcion: 'Dinamarca', codigoSET: 'DNK' },
    { id: 50, codigo: '050', descripcion: 'Dominica', codigoSET: 'DMA' }
  ];

  // Variables para paginación
  currentPage = 1;
  itemsPerPage = 5;
  searchTerm = '';

  // Filtrar países basado en el término de búsqueda
  get filteredPaises(): Pais[] {
    return this.paises.filter(pais =>
      pais.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      pais.codigo.includes(this.searchTerm) ||
      pais.codigoSET.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Obtener países paginados
  get paginatedPaises(): Pais[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPaises.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Cambiar página
  changePage(page: number): void {
    this.currentPage = page;
  }

  // Total de páginas
  get totalPages(): number {
    return Math.ceil(this.filteredPaises.length / this.itemsPerPage);
  }

  // Refrescar datos
  refreshData(): void {
    // Aquí podrías implementar la recarga de datos desde una API
    console.log('Datos refrescados');
  }
}
