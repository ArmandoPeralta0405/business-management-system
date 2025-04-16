import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICategoriaPrograma } from '../../models/categoria_programa.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProgramaService {

  private apiUrl = `${environment.apiUrl}/api/categorias_programas`;

  

  constructor(private http: HttpClient) { }

  getAll(): Observable<ICategoriaPrograma[]> {
    return this.http.get<ICategoriaPrograma[]>(this.apiUrl);
  }
  getById(id: number): Observable<ICategoriaPrograma> {
    return this.http.get<ICategoriaPrograma>(`${this.apiUrl}/${id}`);
  }

  create(categoriaProgramaData: Omit<ICategoriaPrograma, 'id_categoria_programa'>): Observable<ICategoriaPrograma> {  // Cambiamos el tipo de retorno
    return this.http.post<ICategoriaPrograma>(this.apiUrl, categoriaProgramaData);
  }

  update(id: number, categoriaProgramaData: Partial<ICategoriaPrograma>): Observable<ICategoriaPrograma> {  // Cambiamos el tipo de retorno
    return this.http.put<ICategoriaPrograma>(`${this.apiUrl}/${id}`, categoriaProgramaData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
