import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtener cantidad de usuarios
  getUsuariosCount(): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/api/usuarios`)
      .pipe(
        map(usuarios => usuarios.length)
      );
  }

  // Obtener cantidad de artículos
  getArticulosCount(): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/api/articulos`)
      .pipe(
        map(articulos => articulos.length)
      );
  }

  // Obtener cantidad de proveedores
  getProveedoresCount(): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/api/proveedores`)
      .pipe(
        map(proveedores => proveedores.length)
      );
  }

  // Obtener cantidad de programas
  getProgramasCount(): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/api/programas`)
      .pipe(
        map(programas => programas.length)
      );
  }

  // Método genérico para contar cualquier entidad
  getEntityCount(endpoint: string): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/${endpoint}`)
      .pipe(
        map(items => items.length)
      );
  }
}