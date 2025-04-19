import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICategoria } from '../../models/categoria.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = `${environment.apiUrl}/api/categorias`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ICategoria[]> {
    return this.http.get<ICategoria[]>(this.apiUrl);
  }
  getById(id: number): Observable<ICategoria> {
    return this.http.get<ICategoria>(`${this.apiUrl}/${id}`);
  }

  create(impuestoData: Omit<ICategoria, 'id_categoria'>): Observable<ICategoria> {  // Cambiamos el tipo de retorno
    return this.http.post<ICategoria>(this.apiUrl, impuestoData);
  }

  update(id: number, impuestoData: Partial<ICategoria>): Observable<ICategoria> {  // Cambiamos el tipo de retorno
    return this.http.put<ICategoria>(`${this.apiUrl}/${id}`, impuestoData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
